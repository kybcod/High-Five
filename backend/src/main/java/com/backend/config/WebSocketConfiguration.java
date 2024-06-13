package com.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
    private static final long HEART_BEAT = 30 * 1000;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
//                .setAllowedOrigins("http://localhost:5173")
                .setAllowedOrigins("*")
                .withSockJS();
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
//                .setAllowedOrigins("http://localhost:5173");
                .setAllowedOrigins("*");
        System.out.println("registry = " + registry);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.setApplicationDestinationPrefixes("/app");
        // SimpleBroker 위치는 SpringBoot 서버 내부 메모리에 존재
        config.enableSimpleBroker("/topic", "/queue")
                .setHeartbeatValue(new long[]{HEART_BEAT, HEART_BEAT})
                .setTaskScheduler(heartBeatScheduler());
        config.setUserDestinationPrefix("/user");
    }

    @Bean
    public TaskScheduler heartBeatScheduler() {
        return new ThreadPoolTaskScheduler();
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
//        registry.setMessageSizeLimit(4 * 8192); // 메세지 크기 제한
        registry.setSendTimeLimit(15 * 1000); // 메시지 전송 시간 제한 (예: 15초)
        registry.setTimeToFirstMessage(30 * 1000); // 첫 번째 메세지 수신 시간 30초
    }
}
