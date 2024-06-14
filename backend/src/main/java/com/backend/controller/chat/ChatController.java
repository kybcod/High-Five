package com.backend.controller.chat;

import com.backend.domain.chat.ChatRoom;
import com.backend.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService service;

    ///api/chat/${productId}?userId=${account.id}
    @GetMapping(value = "{productId}", params = "userId")
//    @PreAuthorize("isAuthenticated()")
    public void getChatRoomId(
            @PathVariable Integer productId,
            @RequestParam("userId") Integer userId) {
        System.out.println("productId = " + productId);
        System.out.println("userId = " + userId);
        ChatRoom chatRoom = service.selectChatRoomId(productId, userId);
    }
}
