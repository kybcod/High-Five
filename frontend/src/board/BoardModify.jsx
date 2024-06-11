import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function BoardModify() {
  const [board, setBoard] = useState({ title: "", content: "", inserted: "" });
  const toast = useToast();
  const { board_id } = useParams();
  const offset = 1000 * 60 * 60 * 9;

  useEffect(() => {
    axios.get(`/api/board/${board_id}`).then((res) => {
      const boardData = {
        ...res.data,
        inserted: new Date(Date.now() + offset).toISOString(),
      };
      setBoard(boardData);
    });
  }, []);

  function handleClickSaveButton() {
    axios
      .put(`/api/board/modify`, board)
      .then(() => {
        toast({
          status: "success",
          description: `${board_id}번 게시물이 수정되었습니다`,
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: `게시물이 수정되지 않았습니다. 작성 내용을 확인해주세요`,
            position: "top",
          });
        }
      });
  }

  return (
    <Box>
      <Heading>자유게시판 글 수정</Heading>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
            value={board.title}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>상품 상세 내용</FormLabel>
          <Textarea
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
            value={board.content}
          />
        </FormControl>
      </Box>
      <Box>
        <Input type={"hidden"} value={board.inserted} />
      </Box>
      <Box>
        <Button onClick={handleClickSaveButton}>게시글 수정</Button>
      </Box>
    </Box>
  );
}
