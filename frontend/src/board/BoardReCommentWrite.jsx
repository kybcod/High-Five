import { Button, Flex, Stack, Textarea } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";

export function BoardReCommentWrite({
  boardComment,
  setShowReCommentId,
  setIsProcessing,
  refId,
}) {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const { successToast, errorToast } = CustomToast();
  const account = useContext(LoginContext);

  useEffect(() => {
    if (account.isLoggedIn(account.id)) {
      setUserId(account.id);
    }
  }, [account]);

  function handleClickSave() {
    setIsProcessing(true);
    axios
      .post(`/api/board/comment`, {
        boardId: boardComment.boardId,
        content,
        userId,
        commentId: boardComment.commentId,
        commentSeq: boardComment.commentSeq,
        refId,
      })
      .then(() => {
        successToast("답글이 작성되었습니다");
        setContent("");
        setShowReCommentId(null);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("답글 작성에 실패했습니다. 다시 시도해주세요");
        }
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Flex>
      <Textarea
        isDisabled={!account.isLoggedIn()}
        placeholder={
          account.isLoggedIn()
            ? "답글을 작성해 보세요"
            : "답글을 작성하시려면 로그인 하세요"
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Stack>
        <Button onClick={() => handleClickSave(boardComment.id)}>저장</Button>
        <Button onClick={() => setShowReCommentId(null)}>취소</Button>
      </Stack>
    </Flex>
  );
}
