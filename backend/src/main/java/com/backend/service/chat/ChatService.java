package com.backend.service.chat;

import com.backend.domain.auction.BidList;
import com.backend.domain.chat.Chat;
import com.backend.domain.chat.ChatRoom;
import com.backend.domain.product.Product;
import com.backend.domain.user.User;
import com.backend.mapper.auction.AuctionMapper;
import com.backend.mapper.chat.ChatMapper;
import com.backend.mapper.product.ProductMapper;
import com.backend.mapper.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.context.PropertyPlaceholderAutoConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper mapper;
    private final ProductMapper productMapper;
    private final UserMapper userMapper;
    private final AuctionMapper auctionMapper;
    private final PropertyPlaceholderAutoConfiguration propertyPlaceholderAutoConfiguration;

    public Map<String, Object> selectChatRoomId(Integer productId, Integer buyerId, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Integer tokenUserId = Integer.valueOf(authentication.getName());

        // productId, buyerId로 roomInfo 찾기
        ChatRoom chatRoom = mapper.selectChatRoomByIds(productId, buyerId);

        if (chatRoom == null) { // roomInfo 없다면 생성

            ChatRoom newChatRoom = new ChatRoom();

            newChatRoom.setUserId(Integer.valueOf(buyerId));
            newChatRoom.setProductId(Integer.valueOf(productId));

            // SellerId 조회
            newChatRoom.setSellerId(productMapper.selectProductSellerId(newChatRoom.getProductId()));

            // InsertChatRoom
            int roomCreate = mapper.insertChatRoom(newChatRoom);

            if (roomCreate == 1) {
                // room 생성 성공하면 chatRoomId 조회
                newChatRoom = mapper.selectChatRoomByIds(productId, buyerId);
            } else {
                System.out.println("chatRoom get fail");
            }

            chatRoom = newChatRoom;
        }
        result.put("chatRoom", chatRoom);

        // -- 이전 ChatData
        // read_check TRUE 변경
        int success = mapper.updateReadCheck(chatRoom.getId(), tokenUserId);

        List<Chat> previousChatList = mapper.selectChatListByChatRoomId(chatRoom.getId());
        Collections.reverse(previousChatList);
        result.put("previousChatList", previousChatList);


        // userName 추가
        User user = userMapper.selectUserById(chatRoom.getUserId());
        if (user == null) {
            User newUser = new User();
            user.setId(chatRoom.getUserId());
            user.setNickName("탈퇴한 회원");
            user = newUser;
        }
        result.put("user", user.getUserIdAndNickName());

        // sellerName 추가
        user = userMapper.selectUserById(chatRoom.getSellerId());
        if (user == null) {
            User newUser = new User();
            user.setId(chatRoom.getSellerId());
            user.setNickName("탈퇴한 회원");
            user = newUser;
        }
        result.put("seller", user.getUserIdAndNickName());


        // -- product
        // status = false (판매종료), reivewStatus = true (후기 등록됨)
        Product product = productMapper.selectChatProductInfo(productId);
        if (product != null) {
            if (product.getStatus() == false) {
                // 판매 종료 상품 입찰자 아이디 받아오기
                buyerId = auctionMapper.selectBuyerIdByProductId(productId);
            } else {
                // 없으면 0
                buyerId = 0;
            }
        } else {
            Product newProduct = new Product();
            newProduct.setId(0);
            newProduct.setReviewStatus(false);
            newProduct.setTitle("삭제된 상품입니다.");
            newProduct.setPaymentStatus(false);
            newProduct.setStatus(false);
            product = newProduct;
            buyerId = 0;
        }
        Map<String, Object> productMap = product.getProductStatusInfo();
        productMap.put("buyerId", buyerId);
        result.put("product", productMap);

        // -- bidder
        BidList bidder = auctionMapper.selectBidderByProductId(productId, tokenUserId);
        result.put("bidder", bidder);

        return result;
    }

    public void insertMessage(Chat chat) {
        // read_check FALSE 이전 메세지 있으면 TRUE 변경 - apic test 시 axios.get 요청 안 함
        int readCheckSuccess = mapper.updateReadCheck(chat.getChatRoomId(), chat.getUserId());

        ChatRoom chatRoom = mapper.selectChatRoomById(chat.getChatRoomId());

        Boolean prevValue = true;
        Boolean changeValue = false;

        if (chatRoom.getSellerId() != chat.getUserId() && chatRoom.getSellerExit() != false) {
            int success = mapper.updateSellerExitById(chat.getChatRoomId(), chatRoom.getSellerId(), changeValue, prevValue);
        } else if (chatRoom.getUserId() != chat.getUserId() && chatRoom.getUserExit() != false) {
            int success = mapper.updateUserExitById(chat.getChatRoomId(), chatRoom.getUserId(), changeValue, prevValue);
        }

        mapper.insertMessage(chat);
    }

    public List<Map<String, Object>> getChatRoomList(Authentication authentication) {
        Integer tokenUserId = Integer.valueOf(authentication.getName());

        List<Map<String, Object>> result = new ArrayList<>();

        List<ChatRoom> chatRoomList = mapper.selectChatRoomListByUserId(tokenUserId);
        
        for (ChatRoom chatRoom : chatRoomList) {
            Map<String, Object> map = new HashMap<>();

            // -- product : id, title
            Product product = productMapper.selectProductTitleById(chatRoom);
            if (product == null) { // 삭제된 상품일때
                Product newProduct = new Product();
                newProduct.setId(chatRoom.getProductId());
                newProduct.setTitle("삭제된 상품입니다.");
                product = newProduct;
            }
            // -- 상대 user : id, nickName
            Integer userId; // 상대방 아이디 얻기
            if (chatRoom.getSellerId() == tokenUserId) { // 로그인 본인이 판매자면
                // userId, name 얻기
                userId = chatRoom.getUserId();
            } else {
                userId = chatRoom.getSellerId();
            }

            User user = userMapper.selectUserNickNameById(userId);
            if (user == null) {
                User newUser = new User();
                newUser.setId(chatRoom.getUserId());
                newUser.setNickName("탈퇴한 회원");
                user = newUser;
            }

            // -- chat : message, inserted
            Chat chat = mapper.selectMessageByRoomId(chatRoom);
            // -- chat : readCheck count
            int count = mapper.selectNotReadCountById(chatRoom.getId(), tokenUserId);

            if (chat == null) {
                Chat newChat = new Chat();
                newChat.setMessage("대화를 시작해보세요!");
                newChat.setInserted(LocalDateTime.now());
                chat = newChat;
            }

            Map<String, Object> chatMap = new HashMap<>(chat.getChatMessageAndInserted());

            chatMap.put("count", count);
            chatMap.put("time", chat.getTimeFormat());

            map.put("chatRoom", chatRoom.getChatRoomIdAndBuyerId());
            map.put("chat", chatMap);
            map.put("product", product.getProductIdAndTitle());
            map.put("user", user.getUserIdAndNickName());

            result.add(map);
        }
        return result;
    }

    public Integer deleteChatRoomById(Integer chatRoomId, Authentication authentication) {
        Integer tokenUserId = Integer.valueOf(authentication.getName());

        ChatRoom chatRoom = mapper.selectChatRoomById(chatRoomId);

        int success = 0;
        Boolean prevValue = false;
        Boolean changeValue = true;

        if (chatRoom.getSellerId() == tokenUserId && chatRoom.getUserExit() == false) {
            success = mapper.updateSellerExitById(chatRoomId, tokenUserId, changeValue, prevValue);
        } else if (chatRoom.getUserId() == tokenUserId && chatRoom.getSellerExit() == false) {
            success = mapper.updateUserExitById(chatRoomId, tokenUserId, changeValue, prevValue);
        } else {
            success = mapper.deleteAllChatById(chatRoomId);
        }

        return success;
    }
}
