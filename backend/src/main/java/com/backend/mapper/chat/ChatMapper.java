package com.backend.mapper.chat;

import com.backend.domain.chat.Chat;
import com.backend.domain.chat.ChatRoom;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ChatMapper {

    @Select("""
            SELECT *
            FROM chat_room
            WHERE product_id = #{productId} AND user_id = #{buyerId}
            """)
    ChatRoom selectChatRoomByIds(Integer productId, Integer buyerId);

    @Insert("""
            INSERT INTO chat_room (product_id, seller_id, user_id)
            VALUES (#{productId}, #{sellerId}, #{userId})           
            """)
    int insertChatRoom(ChatRoom newChatRoom);

    @Insert("""
            INSERT INTO chat (chat_room_id, user_id, message)
            VALUES (#{chatRoomId}, #{userId}, #{message})
            """)
    int insertMessage(Chat chat);

    @Select("""
            SELECT *
            FROM chat_room
            WHERE user_id = #{tokenUserId} OR seller_id = #{tokenUserId}
            """)
    List<ChatRoom> selectChatRoomListByUserId(Integer tokenUserId);

    @Select("""
            SELECT *
            FROM chat
            WHERE chat_room_id = #{id}
            ORDER BY inserted DESC
            LIMIT 1
            """)
    Chat selectMessageByRoomId(ChatRoom chatRoom);

    @Select("""
            SELECT *
            FROM chat
            WHERE chat_room_id = #{id}
            ORDER BY id DESC
            LIMIT 20
            """)
    List<Chat> selectChatListByChatRoomId(Integer id);
}
