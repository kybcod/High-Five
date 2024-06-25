import axios from "axios";
import { Box, Button, Flex, Textarea } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { CustomToast } from "../../component/CustomToast.jsx";

export function CommentWrite({
  questionId,
  comment,
  setIsEditing,
  isProcessing,
  setIsProcessing,
}) {
  const [content, setContent] = useState(comment ? comment.content : "");
  const account = useContext(LoginContext);
  const { successToast, errorToast } = CustomToast();

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
        successToast(
          comment ? "댓글이 수정되었습니다." : "댓글이 등록되었습니다.",
        );
      })
      .catch((err) => {
        err.response.status === 403
          ? errorToast("관리자만 댓글을 등록할 수 있습니다")
          : errorToast("댓글 등록에 실패하였습니다");
      })
      .finally(() => {
        setIsProcessing(false);
        setIsEditing(false);
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
            {comment && (
              <Button onClick={() => setIsEditing(false)}>취소</Button>
            )}
          </Flex>
        </>
      )}
    </Box>
  );
}
