package com.backend.mapper.chat;

import com.backend.domain.chat.ChatMessage;
import com.backend.domain.chat.ChatRoom;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ChatMapper {

    @Select("""
            SELECT id
            FROM chat_room
            WHERE product_id = #{productId} AND user_id = #{userId}
            """)
    Integer selectRoomId(Integer productId, Integer userId);

    @Insert("""
            INSERT INTO chat_room (product_id, seller_id, user_id)
            VALUES (#{productId}, #{sellerId}, #{userId})           
            """)
    int insertChatRoom(Integer productId, Integer sellerId, Integer userId);

    @Select("""
            SELECT *
            FROM chat_room
            WHERE id = #{roomId}
            """)
    ChatRoom selectChatRoomInfo(Integer roomId);

    @Insert("""
            INSERT INTO chat (chat_room_id, user_id, message)
            VALUES (#{chatRoomId}, #{userId}, #{message})
            """)
    int insertMessage(ChatMessage chatMessage);

    @Select("""
            SELECT *
            FROM chat
            WHERE chat_room_id = #{roomId}
            ORDER BY id DESC
            LIMIT 20
            """)
    List<ChatMessage> selectMessage(Integer roomId);
}
