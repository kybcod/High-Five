package com.backend.controller.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    ///api/chat/${productId}?userId=${account.id}
    @GetMapping(value = "{productId}", params = "userId")
//    @PreAuthorize("isAuthenticated()")
    public void getChatRoomId(
            @PathVariable String productId,
            @RequestParam("userId") String userId) {
    }
}
