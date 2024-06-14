package com.backend.service.chat;

import com.backend.domain.chat.ChatRoom;
import com.backend.mapper.chat.ChatMapper;
import com.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper mapper;
    private final ProductMapper productMapper;

    public ChatRoom selectChatRoomId(Integer productId, Integer userId) {
        // productId, userId로 roomId 찾기
        Integer roomId = mapper.selectRoomId(productId, userId);
        if (roomId == null) {
            System.out.println("room create");
            Integer sellerId = productMapper.selectProductUserId(productId);
            int insertStatus = mapper.insertChatRoom(productId, sellerId, userId);
            System.out.println("insertStatus = " + insertStatus);
            if (insertStatus == 1) {
                System.out.println("insert success");
                roomId = mapper.selectRoomId(productId, userId);
                System.out.println("insert roomId = " + roomId);
            } else {
                System.out.println("insert fail");
            }
        }
        System.out.println("roomId = " + roomId);
        ChatRoom chatRoom = mapper.selectChatRoomInfo(roomId);
        System.out.println("chatRoom = " + chatRoom);
        return null;
    }
}
