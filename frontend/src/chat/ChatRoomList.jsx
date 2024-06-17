import { Box, Heading, Text } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";

export function ChatRoomList() {
  const account = useContext(LoginContext);
  // -- axios.get
  useEffect(() => {
    // TODO : status 추가
    axios
      .get(`/api/chat/list`)
      .then((res) => {
        console.log(res.data);
      })
      .catch()
      .finally();
  }, []);
  return (
    <Box>
      <Heading>채팅방 목록</Heading>
      {/* 상품 제목, 닉네임, 대화내용, 대화시간 */}
      <Box>
        <Text>상품제목</Text>
        <Text>닉네임</Text>
        <Text>대화내용</Text>
        <Text>마지막 대화시간</Text>
      </Box>
    </Box>
  );
}
