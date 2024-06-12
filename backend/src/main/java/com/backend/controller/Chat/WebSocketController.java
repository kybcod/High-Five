package com.backend.controller.Chat;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    // WebSocket 메시지를 보내기 위한 간단한 템플릿을 제공
    private SimpMessagingTemplate template;

    @MessageMapping("/chatroom/{roomId}") // /app/chatroom
    @SendTo("/queue/{roomId}") // 대상자 정의
//    @SubscribeMapping("") // 구독 메세지만
    public String handle(@DestinationVariable String roomId, String str) {
        System.out.println("str = " + str);
        return str + str;
    }
}
