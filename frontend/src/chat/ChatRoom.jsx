import { Box, Button, Heading, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { useParams } from "react-router-dom";

export function ChatRoom() {
  const param = useParams(); // 채널을 구분하는 식별자
  const chatroomId = param.chatroomId;
  const [chatList, setChatList] = useState([]); // 채팅 리스트
  const [chat, setChat] = useState(""); // 입력된 채팅 내용
  // -- GPT
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const roomId = 1;

  useEffect(() => {
    const client = new StompJs.Client({
      brokerURL: "ws://localhost:8080/ws",
      // connectHeaders: {
      //   login: "user",
      //   passcode: "password",
      // },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 30000,
      heartbeatOutgoing: 30000,
      onConnect: function () {
        console.log("Connected to WebSocket");
        client.subscribe(`/user/queue/chat`, callback, { ack: "client" });
        client.subscribe(`/topic/chat/${roomId}`, callback, { ack: "client" });
      },
      onStompError: (frame) => {
        console.error("STOMP error: ", frame);
      },
    });

    client.activate(); // 활성화
    setStompClient(client);

    return () => {
      if (client) {
        disConnect();
      }
    };
  }, [roomId]);

  const callback = (message) => {
    console.log("message: " + message.body);
    console.log("Received message: ", message.body);
    setMessages((prevMessages) => [...prevMessages, message.body]);
    message.ack();
  };

  const sendMessage = () => {
    let chatMessage = {
      roomId: roomId,
      userId: 1,
      message: message,
    };

    stompClient.publish({
      destination: `/app/chat`,
      body: JSON.stringify(chatMessage),
    });

    console.log("Sent message: ", chatMessage);
    // -- 내가 보낸 거
    // let formattedMessage = chatMessage;
    // console.log("formattedMessage", formattedMessage);
    // setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    setMessage("");
  };

  // -- 비활성화
  const disConnect = () => {
    stompClient.deactivate();
    console.log("Disconnected");
  };

  return (
    <Box>
      <Box>
        <Box>
          <Heading>Chat Room: {roomId}</Heading>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
          <Box>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
