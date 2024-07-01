import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatRoom } from "./ChatRoom.jsx";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ChatRoomList() {
  const account = useContext(LoginContext);
  const [chatRoomList, setChatRoomList] = useState([]);
  const [data, setData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  // -- axios.get
  useEffect(() => {
    axios
      .get(`/api/chats/list`)
      .then((response) => {
        if (response.data != null) {
          setData(response.data);
        }
        console.log("Response:", response.data);
      })
      .catch((error) => {
        toast({
          status: "error",
          description: "채팅방 조회 중 문제가 발생하였습니다.",
          position: "top",
          duration: 1500,
        });
        console.error("Error:", error);
        navigate(-1);
      })
      .finally();
  }, []);

  const handleChatSelect = (item) => {
    setShowChat(false);
    setTimeout(() => {
      setSelectedChat(item);
      setShowChat(true);
    });
  };

  const handleBackClick = () => {
    setShowChat(false);
    setTimeout(() => {
      setSelectedChat(null);
    });
  };

  // -- spinner
  if (data == null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box mb={7}>
        <Heading>
          <FontAwesomeIcon icon={faComments} size={"lg"} color={"#2F4858"} />{" "}
          채팅방
        </Heading>
      </Box>
      <Divider orientation="horizontal" mb={5} borderColor={"#2F4858"} />
      <Box display={"flex"} h={"600px"}>
        <Box mr={4} overflowY="auto" w={"40%"}>
          <VStack align="stretch">
            {/* 상품 제목, 닉네임, 대화내용, 대화시간 */}
            {data.map((item, index) => (
              <Box
                key={index}
                border={
                  selectedChat?.chatRoom.id === item.chatRoom.id
                    ? "3px solid #00A457"
                    : "1px solid #d5d5d5"
                }
                boxShadow="lg"
                height={"130px"}
                borderRadius={"10px"}
              >
                <Box w={"90%"} m={2}>
                  <Button
                    mt={2}
                    size="lg"
                    variant="link"
                    color={"#2F4858"}
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    isDisabled={item.product.title === "삭제된 상품입니다."}
                  >
                    {item.product.title}
                  </Button>
                </Box>
                <Box m={2}>
                  <Flex>
                    <HStack spacing={4}>
                      <Center>
                        <Button
                          variant="link"
                          color={"#2F4858"}
                          onClick={() =>
                            navigate(`/myPage/${item.user.id}/shop`)
                          }
                          isDisabled={item.user.nickName === "탈퇴한 회원"}
                        >
                          {item.user.nickName}
                        </Button>
                      </Center>
                      <Box fontSize={"xs"} color={"#00A457"}>
                        {item.chat.message === "대화를 시작해보세요!"
                          ? item.chatRoom.time
                          : item.chat.time}
                      </Box>
                    </HStack>
                  </Flex>
                </Box>
                <Box
                  border={"1px solid #f1f1f1"}
                  boxShadow="sm"
                  borderRadius={"10px"}
                  mt={4}
                  ml={1}
                  mr={1}
                  h={"35px"}
                  lineHeight={"30px"}
                  cursor={"pointer"}
                  onClick={() => handleChatSelect(item)}
                >
                  <Flex>
                    <Box
                      w={"90%"}
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                      overflow={"hidden"}
                      ml={2}
                    >
                      {item.chat.message}
                    </Box>
                    <Box w={"10%"} color={"#00A457"} as="b">
                      {item.chat.count > 0 && item.chat.count}
                    </Box>
                  </Flex>
                </Box>
              </Box>
            ))}
          </VStack>
        </Box>
        <Box w={"60%"}>
          {showChat && selectedChat && (
            <ChatRoom
              pId={selectedChat.product.id}
              bId={selectedChat.chatRoom.userId}
              onBackClick={handleBackClick}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
