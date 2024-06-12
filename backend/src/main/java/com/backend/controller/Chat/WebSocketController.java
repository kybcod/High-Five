package com.backend.controller.Chat;

import com.backend.domain.Chat.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    // WebSocket 메시지를 보내기 위한 간단한 템플릿을 제공
    private final SimpMessagingTemplate template;

    public WebSocketController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/chat") // /app/chatroom
    public void receiveMessage(ChatMessage chatMessage) throws Exception {
        String roomId = String.valueOf(chatMessage.getRoomId());
        System.out.println("chatMessage = " + chatMessage);
        // 메세지를 보낸 사용자에게 응답을 보냄(채팅 전송)
        template.convertAndSendToUser(roomId, "/queue/chat", chatMessage);
        // 메시지를 채팅방의 다른 사용자에게 보냄(채팅방 조회)
        template.convertAndSend("/topic/chat/" + roomId, chatMessage);
    }

    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        return exception.getMessage();
    }
}
