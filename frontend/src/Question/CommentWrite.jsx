import axios from "axios";
import { Box, Button, Flex, Input, Textarea, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";

export function CommentWrite({ questionId }) {
  const [content, setContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();
  const account = useContext(LoginContext);

  function handleWriteClick() {
    setIsProcessing(true);
    axios
      .post(`/api/question/comment`, {
        content,
        questionId,
        // userId: account.userId,
      })
      .then(() => {
        // todo : DOM을 직접 수정하는건 안좋은 방식. 다른 방식으로 생각해보기
        setContent("");
        toast({
          description: "댓글이 등록되었습니다.",
          status: "info",
          position: "top",
          duration: 2000,
        });
      })
      .catch()
      .finally(() => {
        setIsProcessing(false);
      });
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
