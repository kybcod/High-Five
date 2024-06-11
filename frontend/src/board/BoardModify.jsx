import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function BoardModify() {
  const [board, setBoard] = useState("");
  const [inserted, setInserted] = useState("");
  const { board_id } = useParams();
  const offset = 1000 * 60 * 60 * 9;

  useEffect(() => {
    const LocalDateTime = new Date(Date.now() + offset).toISOString();
    setInserted(LocalDateTime);
    axios.get(`/api/board/${board_id}`).then((res) => setBoard(res.data));
  }, []);

  function handleClickSaveButton() {
    axios.put("/api/board/modify", board);
  }

  return (
    <Box>
      <Heading>자유게시판 글 수정</Heading>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>상품 상세 내용</FormLabel>
          <Textarea
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
          />
        </FormControl>
      </Box>
      <Box>
        <Input type={"hidden"} value={inserted} />
      </Box>
      <Box>
        <Button onClick={handleClickSaveButton}>게시글 수정</Button>
      </Box>
    </Box>
  );
}
