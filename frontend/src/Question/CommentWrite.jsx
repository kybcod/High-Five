import axios from "axios";
import { Box, Button, Input, Textarea } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";

export function CommentWrite({ questionId }) {
  const [content, setContent] = useState("");
  const account = useContext(LoginContext);

  // questionId, userId, content 어떻게 backend로 넘겨줄까?
  // questionId => prop으로
  function handleWriteClick() {
    axios.post(`/api/question/comment`, { content, questionId });
  }

  return (
    <Box>
      <Textarea onChange={(e) => setContent(e.target.value)} value={content} />
      <Button onClick={handleWriteClick}>등록</Button>
    </Box>
  );
}
