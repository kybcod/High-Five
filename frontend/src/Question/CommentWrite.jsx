import axios from "axios";
import { Box, Button, Flex, Input, Textarea, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";

export function CommentWrite({ questionId, comment }) {
  const [content, setContent] = useState(comment ? comment.content : "");
  const [isProcessing, setIsProcessing] = useState(false);
  const toast = useToast();
  const account = useContext(LoginContext);

  function handleWriteClick() {
    setIsProcessing(true);
    const request = comment
      ? axios.put(`/api/question/comment/${comment.id}`, {
          content,
          id: comment.id,
        })
      : axios.post(`/api/question/comment`, {
          content,
          questionId,
          userId: account.userId,
        });

    request
      .then(() => {
        // todo : DOM을 직접 수정하는건 안좋은 방식. 다른 방식으로 생각해보기
        setContent("");
        toast({
          description: comment
            ? "댓글이 수정되었습니다."
            : "댓글이 등록되었습니다.",
          status: "info",
          position: "top",
          duration: 2000,
        });
      })
      .catch((err) => {
        if (err.response.status === 403) {
          toast({
            description: "관리자만 댓글을 등록할 수 있습니다",
            status: "error",
            position: "top",
            duration: 2500,
          });
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Box>
      {account.isAdmin(account.userId) && (
        <>
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
              {comment ? "수정" : "등록"}
            </Button>
          </Flex>
        </>
      )}
    </Box>
  );
}
