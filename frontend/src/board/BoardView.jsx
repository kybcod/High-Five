import { Box, Heading, Text, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function BoardView() {
  const { board_id } = useParams();
  const [board, setBoard] = useState("");

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
      <Box>
        <Text>{board.userId}</Text>
        <Text>{board.inserted}</Text>
      </Box>
      <Box>
        <Textarea value={board.content} readOnly />
      </Box>
    </Box>
  );
}
