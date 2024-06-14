package com.backend.service.chat;

import com.backend.mapper.chat.ChatMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class ChatService {

    private final ChatMapper chatMapper;

    public void selectChatRoomId(String productId, String userId) {
        // productId로 sellerId 찾기
        Integer sellerId;
        sellerId = chatMapper.selectSellerIdByProductId(productId);
        System.out.println("sellerId = " + sellerId);
    }
}
