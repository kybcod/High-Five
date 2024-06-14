package com.backend.service.chat;

import com.backend.domain.chat.ChatMessage;
import com.backend.domain.chat.ChatProduct;
import com.backend.domain.chat.ChatRoom;
import com.backend.mapper.chat.ChatMapper;
import com.backend.mapper.product.ProductMapper;
import com.backend.mapper.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper mapper;
    private final ProductMapper productMapper;
    private final UserMapper userMapper;

    public Map<String, Object> selectChatRoomId(Integer productId, Authentication authentication) {
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
        }
        // chat_room DB 정보 조회
        ChatRoom chatRoom = mapper.selectChatRoomInfo(roomId);

        // userName 추가
        chatRoom.setUserName(jwt.getClaim("nickName"));

        // sellerName 추가
        String sellerName = userMapper.selectSellerName(chatRoom);
        chatRoom.setSellerName(sellerName);

        // -- chat product info
        // ChatProduct status = 1: 판매중, 0: 판매완료
        ChatProduct chatProduct = productMapper.selectChatProductInfo(productId);
        if (chatProduct.getStatus() != 1) {
            Integer buyerId = productMapper.selectBuyerId(productId);
            chatProduct.setBuyerId(buyerId);
        }

        // -- result 에 담기
        Map<String, Object> result = new HashMap<>();
        result.put("chatRoom", chatRoom);
        result.put("chatProduct", chatProduct);
        return result;
    }

    public void insertMessage(ChatMessage chatMessage) {
        int success = mapper.insertMessage(chatMessage);
        System.out.println("success = " + success);
    }
}
