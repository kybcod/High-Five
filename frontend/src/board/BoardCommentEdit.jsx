import { Box, Button, Flex, Stack, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { useNavigate } from "react-router-dom";

export function BoardCommentEdit({
  boardComment,
  setIsEditingId,
  updatedContent,
  setUpdatedContent,
}) {
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();

  function handleClickSave() {
    axios
      .put(`/api/board/comment/modify`, {
        id: boardComment.id,
        content: updatedContent,
      })
      .then(() => {
        successToast(`댓글 수정이 완료되었습니다`);
        setIsEditingId(null);
      })
      .catch(() => {
        errorToast(`댓글 수정에 실패했습니다. 다시 시도해주세요`);
      })
      .finally(() => {});
  }

  return (
    <Box>
      <Flex>
        <Textarea
          defaultValue={boardComment.content}
          onChange={(e) => setUpdatedContent(e.target.value)}
        />
        <Stack>
          <Button onClick={handleClickSave}>저장</Button>
          <Button onClick={() => setIsEditingId(null)}>취소</Button>
        </Stack>
      </Flex>
    </Box>
  );
}
