import axios from "axios";
import { Box, Button, Flex, Stack, Textarea } from "@chakra-ui/react";
import { CustomToast } from "../component/CustomToast.jsx";

export function BoardReCommentEdit({
  subComment,
  setIsEditingId,
  updatedContent,
  setUpdatedContent,
}) {
  const { successToast, errorToast } = CustomToast();

  function handleClickSave() {
    axios
      .put(`/api/board/comment/modify`, {
        id: subComment.id,
        content: updatedContent,
      })
      .then(() => {
        successToast(`답글 수정이 완료되었습니다`);
        subComment.content = updatedContent;
        setIsEditingId(null);
      })
      .catch(() => {
        errorToast(`답글 수정에 실패했습니다. 다시 시도해주세요`);
      })
      .finally(() => {});
  }

  return (
    <Box>
      <Flex>
        <Textarea
          defaultValue={subComment.content}
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
