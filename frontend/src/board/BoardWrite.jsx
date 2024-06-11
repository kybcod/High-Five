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
import { useNavigate } from "react-router-dom";
import { CustomToast } from "../component/CustomToast.jsx";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [inserted, setInserted] = useState("");
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();
  const offset = 1000 * 60 * 60 * 9;

  useEffect(() => {
    const LocalDateTime = new Date(Date.now() + offset).toISOString();
    setInserted(LocalDateTime);
  }, []);

  function handleClickButton() {
    axios
      .post("/api/board/add", {
        title,
        content,
        inserted,
      })
      .then(() => {
        successToast("게시물 작성이 완료되었습니다");
        navigate("/board/list");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("게시물 작성에 실패했습니다. 다시 작성해주세요");
        }
      });
  }

  return (
    <Box>
      <Heading>자유게시판 글 작성</Heading>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>상품 상세 내용</FormLabel>
          <Textarea onChange={(e) => setContent(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <Input type={"hidden"} value={inserted} />
      </Box>
      <Box>
        <Button onClick={handleClickButton}>게시글 생성</Button>
      </Box>
    </Box>
  );
}
