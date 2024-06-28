package com.backend.mapper.chat;

import com.backend.domain.chat.Chat;
import com.backend.domain.chat.ChatRoom;
import org.apache.ibatis.annotations.*;

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
            WHERE user_id = #{tokenUserId} AND user_exit = FALSE 
               OR seller_id = #{tokenUserId} AND seller_exit = FALSE
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

    @Update("""
            UPDATE chat
            SET read_check = TRUE
            WHERE chat_room_id = #{id}
                AND user_id != #{tokenUserId} 
                AND read_check = FALSE
            ORDER BY id DESC
            """)
    int updateReadCheck(Integer id, Integer tokenUserId);

    @Select("""
            SELECT COUNT(read_check)
            FROM chat
            WHERE chat_room_id = #{id}
                AND user_id != #{tokenUserId}
                AND read_check = FALSE
            ORDER BY id DESC
            """)
    int selectNotReadCountById(Integer id, Integer tokenUserId);

    @Select("""
            SELECT * FROM chat_room WHERE id = #{id}
            """)
    ChatRoom selectChatRoomById(Integer id);

    @Update("""
            UPDATE chat_room
            SET seller_exit = #{changeValue}
            WHERE id = #{id}
                AND seller_id = #{tokenUserId}
                AND seller_exit = #{prevValue}
            """)
    int updateSellerExitById(Integer id, Integer tokenUserId, Boolean changeValue, Boolean prevValue);

    @Update("""
            UPDATE chat_room
            SET user_exit = #{changeValue}
            WHERE id = #{id}
                AND user_id = #{tokenUserId}
                AND user_exit = #{prevValue}
            """)
    int updateUserExitById(Integer id, Integer tokenUserId, Boolean changeValue, Boolean prevValue);

    @Delete("""
            DELETE chat, chat_room
            FROM chat 
            LEFT JOIN chat_room
            ON chat.chat_room_id = chat_room.id
            WHERE chat.chat_room_id = #{chatRoomId}
            """)
    int deleteAllChatById(Integer chatRoomId);
}
