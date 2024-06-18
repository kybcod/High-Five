import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";

export function ChatRoomList() {
  const account = useContext(LoginContext);
  const [chatRoomList, setChatRoomList] = useState([]);
  const [obj, setObj] = useState(null);
  // -- axios.get
  useEffect(() => {
    // TODO : status 추가
    axios
      .get(`/api/chats/list`)
      .then((res) => {
        console.log(res.data);
        setChatRoomList(res.data);
      })
      .catch()
      .finally();
  }, []);
  // spinner
  if (chatRoomList == null) {
    return <Spinner />;
  }
  return (
    <Box>
      <Heading>채팅방 목록</Heading>
      {/* 상품 제목, 닉네임, 대화내용, 대화시간 */}
      {chatRoomList.map((item, index) => {
        <Box key={index}>
          <Text>text</Text>
          {/*<Text>{title}</Text>*/}
          {/*<Text>닉네임</Text>*/}
          {/*<Text>대화내용</Text>*/}
          {/*<Text>마지막 대화시간</Text>*/}
        </Box>;
      })}
    </Box>
  );
}
