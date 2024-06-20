import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ChatRoomList() {
  const account = useContext(LoginContext);
  const [chatRoomList, setChatRoomList] = useState([]);
  const navigate = useNavigate();

  // -- axios.get
  useEffect(() => {
    // TODO : status 추가
    axios
      .get(`/api/chats/list`)
      .then((res) => {
        setChatRoomList(res.data);
      })
      .catch()
      .finally();
  }, []);
  // -- spinner
  if (chatRoomList == null) {
    return <Spinner />;
  }

  return (
    <Box width={"40%"}>
      <Heading>채팅방 목록</Heading>

      {/* 상품 제목, 닉네임, 대화내용, 대화시간 */}
      {chatRoomList.map((item, index) => (
        <Box key={index} border={"1px solid gray"} height={"110px"}>
          <Box m={2}>
            <Button
              size="lg"
              variant="link"
              onClick={() => navigate(`/product/${item.product.id}`)}
            >
              {item.product.title}
            </Button>
          </Box>
          <Box m={2}>
            <Flex>
              <HStack spacing={4}>
                <Center bgColor={"blue"}>
                  <Button
                    variant="link"
                    onClick={() => navigate(`/myPage/${item.user.id}/shop`)}
                  >
                    {item.user.nickName}
                  </Button>
                </Center>
                <Box fontSize={"xs"} color={"blue.300"}>
                  {item.chat.inserted}
                </Box>
              </HStack>
            </Flex>
          </Box>
          <Box
            bgColor={"gray.200"}
            m={2}
            onClick={() =>
              navigate(
                `/chat/product/${item.product.id}/buyer/${item.chatRoom.userId}`,
              )
            }
          >
            <Box cursor={"pointer"}>{item.chat.message}</Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
