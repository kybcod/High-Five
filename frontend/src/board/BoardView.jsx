import { Box, Flex, Heading, Spacer, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function BoardView() {
  const [board, setBoard] = useState("");
  const navigate = useNavigate();
  const { board_id } = useParams();

  useEffect(() => {
    axios.get(`/api/board/${board_id}`).then((res) => setBoard(res.data));
  }, []);

  return (
    <Box>
      <Box>
        <Heading>자유게시판 게시글</Heading>
      </Box>
      <Box>
        <Text fontSize="30px">{board.title}</Text>
      </Box>
      <Flex>
        <Box>
          <Text>{board.userId}</Text>
          <Text>{board.inserted}</Text>
        </Box>
        <Spacer />
        <Box>
          <Text onClick={() => navigate(`/board/modify/${board_id}`)}>
            수정
          </Text>
        </Box>
        <Box>
          <Text>삭제</Text>
        </Box>
      </Flex>
      <Box>
        <Textarea value={board.content} readOnly />
      </Box>
    </Box>
  );
}
