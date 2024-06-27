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
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // -- axios.get
  useEffect(() => {
    // TODO : status 추가
    axios
      .get(`/api/chats/list`)
      .then((res) => {
        console.log(res.data);
        if (res.data != null) {
          setData(res.data);
        }
      })
      .catch()
      .finally();
  }, []);

  // -- spinner
  if (data == null) {
    return <Spinner />;
  }

  return (
    <Box width={"40%"}>
      <Heading>채팅방 목록</Heading>

      {/* 상품 제목, 닉네임, 대화내용, 대화시간 */}
      {data.map((item, index) => (
        <Box key={index} border={"1px solid gray"} height={"110px"}>
          <Box m={2}>
            <Button
              size="lg"
              variant="link"
              whiteSpace={"nowrap"}
              textOverflow={"ellipsis"}
              overflow={"hidden"}
              onClick={() => navigate(`/product/${item.product.id}`)}
              isDisabled={
                item.product.title == "삭제된 상품입니다." ? true : false
              }
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
                    isDisabled={
                      item.user.nickName == "탈퇴한 회원" ? true : false
                    }
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
            h={"30px"}
            lineHeight={"30px"}
            cursor={"pointer"}
            onClick={() =>
              navigate(
                `/chat/product/${item.product.id}/buyer/${item.chatRoom.userId}`,
              )
            }
          >
            <Flex>
              <Box
                w={"90%"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                overflow={"hidden"}
              >
                {item.chat.message}
              </Box>
              <Box w={"10%"} color={"blue.500"}>
                {item.chat.count > 0 && item.chat.count}
              </Box>
            </Flex>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
