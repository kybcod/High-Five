import { Box, Button, Heading, Input, Spinner } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";

export function ChatRoom() {
  const { productId } = useParams();
  const account = useContext(LoginContext);
  // const chatroomId = param.chatroomId;
  const [chatList, setChatList] = useState([]); // 채팅 리스트
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [chat, setChat] = useState(""); // 입력된 채팅 내용
  // -- GPT
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const userId = 1;
  const [messages, setMessages] = useState([]);
  // -- axios.get
  useEffect(() => {
    axios
      .get(`/api/chat/${productId}`)
      .then((res) => {
        console.log(res.data);
        setRoomInfo(res.data);
        setRoomId(res.data.id);
      })
      .catch()
      .finally();
  }, []);

  // -- stomp
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
        client.subscribe(`/user/queue/chat`, callback, { ack: "client" }); // 상대방
        client.subscribe(`/topic/chat/${roomInfo.id}`, callback, {
          ack: "client",
        }); // 본인
      },
      onStompError: (frame) => {
        console.error("STOMP error: ", frame);
      },
    });

    client.activate(); // 활성화
    setStompClient(client);

    // return () => {
    //   if (client) {
    //     disConnect();
    //   }
    // };
  }, [roomId]);

  const callback = (message) => {
    const receivedMessage = JSON.parse(message.body);
    console.log("receivedMessage : ", receivedMessage);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    message.ack();
  };

  const sendMessage = () => {
    let chatMessage = {
      roomId,
      userId,
      message: message,
    };
    console.log("send Message!");
    stompClient.publish({
      destination: `/app/chat`,
      body: JSON.stringify(chatMessage),
    });

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
  if (roomInfo == null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>
        <Box>
          <Heading>No.{roomInfo.id} ChatRoom</Heading>
          <Box>
            {messages.map((msg, index) => (
              <Box key={index}>
                <li>
                  [{msg.roomId}] {msg.userId}: {msg.message}
                </li>
              </Box>
            ))}
          </Box>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>send</Button>
        </Box>
      </Box>
    </Box>
  );
}
