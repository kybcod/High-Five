package com.backend.controller.chat;

import com.backend.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {
    private final ChatService service;

    ///api/chat/${productId}?userId=${account.id}
    // 채팅방 첫 입장 시 룸 정보 조회
    @GetMapping("/products/{productId}/buyer/{buyerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getChatRoomInfo(
            @PathVariable Integer productId, @PathVariable Integer buyerId, Authentication authentication) {

        // TODO : 로직 전부 변경 예정 후 status 추가
        Map<String, Object> result = service.selectChatRoomId(productId, buyerId, authentication);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getChatList(Authentication authentication) {
        // TODO : status 추가 예정
        List<Map<String, Object>> result = service.getChatRoomList(authentication);
        return ResponseEntity.ok().body(result);
    }
}
