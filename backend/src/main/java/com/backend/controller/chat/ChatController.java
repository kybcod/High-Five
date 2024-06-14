package com.backend.controller.chat;

import com.backend.domain.chat.ChatRoom;
import com.backend.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService service;

    ///api/chat/${productId}?userId=${account.id}
    // 채팅방 첫 입장 시 룸 정보 조회
    @GetMapping("{productId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getChatRoomInfo(
            @PathVariable Integer productId, Authentication authentication) {
        ChatRoom chatRoom = service.selectChatRoomId(productId, authentication);
        return ResponseEntity.ok().body(chatRoom);
    }
}
