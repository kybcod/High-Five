package com.backend.service.chat;

import com.backend.domain.chat.ChatRoom;
import com.backend.mapper.chat.ChatMapper;
import com.backend.mapper.product.ProductMapper;
import com.backend.mapper.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper mapper;
    private final ProductMapper productMapper;
    private final UserMapper userMapper;

    public ChatRoom selectChatRoomId(Integer productId, Authentication authentication) {
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

        return chatRoom;
    }
}
