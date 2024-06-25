import { Box, Button, Flex, Textarea } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";

export function BoardCommentWrite({ boardId, setIsProcessing, isProcessing }) {
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const { successToast, errorToast } = CustomToast();
  const account = useContext(LoginContext);

  useEffect(() => {
    if (account.isLoggedIn(account.id)) {
      setUserId(account.id);
    }
  }, [account]);

  function handleClickComment() {
    setIsProcessing(true);
    axios
      .post(`/api/board/comment`, {
        boardId,
        content,
        userId,
        commentId: 0,
        commentSeq: 0,
        refId: 0,
      })
      .then(() => {
        successToast("댓글이 작성되었습니다");
        setContent("");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("댓글 작성에 실패했습니다. 다시 시도해주세요");
        }
      })
      .finally(() => setIsProcessing(false));
  }

  let disableSaveButton = false;
  if (content.length === 0) {
    disableSaveButton = true;
  }

  return (
    <Box>
      <Flex>
        <Textarea
          isDisabled={!account.isLoggedIn()}
          placeholder={
            account.isLoggedIn()
              ? "댓글을 작성해 보세요"
              : "댓글을 작성하시려면 로그인 하세요"
          }
          resize={"none"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          isDisabled={disableSaveButton}
          isLoading={isProcessing}
          onClick={handleClickComment}
        >
          입력
        </Button>
      </Flex>
    </Box>
  );
}
