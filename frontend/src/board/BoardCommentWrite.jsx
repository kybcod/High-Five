import { Box, Button, Flex, Textarea } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";

export function BoardCommentWrite({ boardId, setIsProcessing, isProcessing }) {
  const [boardComment, setBoardComment] = useState("");
  const account = useContext(LoginContext);

  function handleClickComment() {
    axios.post(`/api/board/comment`).then(() => {
      setBoardComment("");
    });
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
          value={boardComment}
          onChange={(e) => setBoardComment(e.target.value)}
        />
        <Button onClick={handleClickComment}>입력</Button>
      </Flex>
    </Box>
  );
}
