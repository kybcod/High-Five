package com.backend.controller.chat;

import com.backend.domain.chat.Chat;
import com.backend.service.chat.ChatService;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    // WebSocket 메시지를 보내기 위한 간단한 템플릿을 제공
    private final SimpMessagingTemplate template;
    private final ChatService service;

    public WebSocketController(SimpMessagingTemplate template, ChatService service) {
        this.template = template;
        this.service = service;
    }

    @MessageMapping("/chat") // /app/chatroom
    @PreAuthorize("isAuthenticated()")
    public void receiveMessage(Chat chat) throws Exception {
        String chatRoomId = String.valueOf(chat.getChatRoomId());
        // 메세지를 보낸 사용자에게 응답을 보냄(채팅 전송)
        template.convertAndSendToUser(chatRoomId, "/queue/chat", chat);
        // 메시지를 채팅방의 다른 사용자에게 보냄(채팅방 조회)
        template.convertAndSend("/topic/chat/" + chatRoomId, chat);
        // ChatMessage save
        service.insertMessage(chat);
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }
}
