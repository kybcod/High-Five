package com.backend.service.chat;

import com.backend.domain.chat.Chat;
import com.backend.domain.chat.ChatMessage;
import com.backend.domain.chat.ChatProduct;
import com.backend.domain.chat.ChatRoom;
import com.backend.domain.product.Product;
import com.backend.domain.user.User;
import com.backend.mapper.chat.ChatMapper;
import com.backend.mapper.product.ProductMapper;
import com.backend.mapper.user.UserMapper;
import lombok.RequiredArgsConstructor;
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

    public Map<String, Object> selectChatRoomId(Integer productId, Authentication authentication) {
        Map<String, Object> result = new HashMap<>();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Integer userId = Integer.valueOf(authentication.getName());

        // productId, userId로 roomId 찾기
        Integer roomId = mapper.selectRoomId(productId, userId);

        // roomId가 없다면 생성
        if (roomId == null) {
            // SellerId 조회
            Integer sellerId = productMapper.selectProductSellerId(productId);

            // InsertChatRoom
            int roomStatus = mapper.insertChatRoom(productId, sellerId, userId);

            if (roomStatus == 1) {
                // room 생성 성공하면 roomId 조회
                roomId = mapper.selectRoomId(productId, userId);
            } else {
                System.out.println("chatRoom get fail");
            }
            // -- 신규 메세지
            result.put("firstChat", "채팅방 입장을 환영합니다.");
        } else {
            // -- 이전 ChatData
            List<ChatMessage> messageList = mapper.selectMessage(roomId);
            Collections.reverse(messageList);
            result.put("messageList", messageList);
        }
        // -- chat_room info
        ChatRoom chatRoom = mapper.selectChatRoomInfo(roomId);

        // userName 추가
//        chatRoom.setUserName(jwt.getClaim("nickName"));

        // sellerName 추가
        String sellerName = userMapper.selectSellerName(chatRoom);
//        chatRoom.setSellerName(sellerName);

        // -- chat product info
        // ChatProduct status = 1: 판매중, 0: 판매완료
        ChatProduct chatProduct = productMapper.selectChatProductInfo(productId);
        if (chatProduct.getStatus() != 1) {
            Integer buyerId = productMapper.selectBuyerId(productId);
            chatProduct.setBuyerId(buyerId);
        }

        // -- result 에 담기
        result.put("chatRoom", chatRoom);
        result.put("chatProduct", chatProduct);
        return result;
    }

    public void insertMessage(ChatMessage chatMessage) {
        int success = mapper.insertMessage(chatMessage);
    }

    public List<Map<String, Object>> getChatRoomList(Authentication authentication) {
        Integer tokenUserId = Integer.valueOf(authentication.getName());

        List<Map<String, Object>> result = new ArrayList<>();
        
        List<ChatRoom> chatRoomList = mapper.selectChatRoomListByUserId(tokenUserId);
        for (ChatRoom chatRoom : chatRoomList) {
            Map<String, Object> map = new HashMap<>();

            // -- product : id, title
            Product product = productMapper.selectProductTitleById(chatRoom);

            // -- 상대 user : id, nickName
            Integer userId; // 상대방 아이디 얻기
            if (chatRoom.getSellerId() == tokenUserId) { // 로그인 본인이 판매자면
                // userId, name 얻기
                userId = chatRoom.getUserId();
            } else {
                userId = chatRoom.getSellerId();
            }
            User user = userMapper.selectUserNickNameById(userId);

            // -- chat : message, inserted
            Chat chat = mapper.selectMessageByRoomId(chatRoom);
            if (chat == null) {
                Chat newChat = new Chat();
                newChat.setMessage("대화를 시작해보세요!");
                newChat.setInserted(LocalDateTime.now());
                chat = newChat;
            }

            map.put("chatRoom", chatRoom.getChatRoomIdAndBuyerId());
            map.put("chat", chat.getChatMessageAndInserted());
            map.put("product", product.getProductIdAndTitle());
            map.put("user", user.getUserIdAndNickName());

            result.add(map);
        }
        return result;
    }
}
