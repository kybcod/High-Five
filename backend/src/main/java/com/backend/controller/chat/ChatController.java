package com.backend.controller.chat;

import com.backend.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {
    private final ChatService service;
    private final ChatService chatService;

    ///api/chat/${productId}?userId=${account.id}
    // 채팅방 첫 입장 시 룸 정보 조회
    @GetMapping("/products/{productId}/buyer/{buyerId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getChatRoomInfo(
            @PathVariable Integer productId, @PathVariable Integer buyerId, Authentication authentication) {
        Map<String, Object> result = service.selectChatRoomId(productId, buyerId, authentication);
        if (result.size() == 0 || result == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok().body(result);
    }

    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity getChatList(Authentication authentication) {
        List<Map<String, Object>> result = service.getChatRoomList(authentication);
        if (result.size() == 0 || result == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("{chatRoomId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity deleteChatRoom(@PathVariable Integer chatRoomId, Authentication authentication) {
        Integer success = service.deleteChatRoomById(chatRoomId, authentication);
        if (success > 0) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
