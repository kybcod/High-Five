import { Box, Button, Flex, Input, Spinner, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { ProductStateComp } from "./chatComponent/ProductStateComp.jsx";

const ChatRoomDeleteComp = () => {
  return (
    <>
      <Button colorScheme={"yellow"}>채팅삭제</Button>
    </>
  );
};

export function ChatRoom() {
  const { productId } = useParams();
  const account = useContext(LoginContext);
  // const chatroomId = param.chatroomId;
  const [chatList, setChatList] = useState([]); // 채팅 리스트
  const [roomInfo, setRoomInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [chat, setChat] = useState(""); // 입력된 채팅 내용
  // -- GPT
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState("");
  const userId = 1;
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  // -- axios.get
  useEffect(() => {
    axios
      .get(`/api/chat/${productId}`)
      .then((res) => {
        setRoomInfo(res.data.chatRoom);
        setProductInfo(res.data.chatProduct);
        setRoomId(res.data.chatRoom.id);
        if (!res.data.firstChat) {
          setMessages(res.data.messageList);
        }
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
      heartbeatIncoming: 30 * 1000,
      heartbeatOutgoing: 30 * 1000,
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
  }, []); // 로딩 속도 붙길래 걸어버림

  const callback = (message) => {
    const receivedMessage = JSON.parse(message.body);
    console.log("receivedMessage : ", receivedMessage);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    message.ack();
  };

  const sendMessage = () => {
    let chatMessage = {
      chatRoomId: roomInfo.id,
      userId: account.id,
      message: message,
    };
    console.log("send Message!");
    stompClient.publish({
      destination: `/app/chat`,
      body: JSON.stringify(chatMessage),
    });

    // -- 내가 보낸 거
    let formattedMessage = chatMessage;
    console.log("formattedMessage", formattedMessage);
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);
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
        <Button colorScheme={"yellow"}>
          {/* 경로 수정 : 채팅 목록*/}
          ChatList
        </Button>
      </Box>
      <Box>
        <Flex>
          <Box>
            <Link to={`/product/${productInfo.id}`}>{productInfo.title}</Link>
          </Box>
          <Button
            onClick={() => navigate(`/shop/${roomInfo.sellerId}/products`)}
            colorScheme={"yellow"}
          >
            {/* 경로 수정 예정 : 내 정보 확인 -> 닉네임 상점 */}
            {roomInfo.sellerName} 상점
          </Button>
        </Flex>
        <Flex>
          <ProductStateComp
            productInfo={productInfo}
            userId={`${account.id}`}
          />
          <ChatRoomDeleteComp />
        </Flex>
      </Box>
      <Box>
        <Box>
          <Box>
            {messages.map((msg, index) => (
              <Box key={index}>
                <Flex>
                  <Text>
                    {msg.userId == account.id ? (
                      <>{roomInfo.userName}</>
                    ) : (
                      <>{roomInfo.sellerName}</>
                    )}
                  </Text>
                  <Text> : {msg.message}</Text>
                </Flex>
                <Text fontSize={"xs"}>{msg.inserted}</Text>
              </Box>
            ))}
          </Box>
          <Box>
            <Flex>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={sendMessage}>send</Button>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
