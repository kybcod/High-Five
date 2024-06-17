import axios from "axios";
import { Box, Button, Flex, Input, Textarea } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";

export function CommentWrite({ questionId, isProcessing, setIsProcessing }) {
  const [content, setContent] = useState("");
  const account = useContext(LoginContext);

  function handleWriteClick() {
    setIsProcessing(true);
    axios
      .post(`/api/question/comment`, { content, questionId })
      .then(setIsProcessing(false));
  }

  return (
    <Box>
      <Flex gap={2}>
        <Textarea
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
        <Button
          onClick={handleWriteClick}
          isDisabled={content.trim().length === 0}
          isLoading={isProcessing}
        >
          등록
        </Button>
      </Flex>
    </Box>
  );
}
