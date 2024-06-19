import { Box, Button, Flex, Stack, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";

export function BoardCommentEdit({
  boardComment,
  setIsEditing,
  updatedContent,
  setUpdatedContent,
}) {
  const { successToast, errorToast } = CustomToast();

  function handleClickSave(id) {
    axios
      .put(`/api/board/comment/modify/${id}`, {
        content: updatedContent,
        inserted: boardComment.inserted,
      })
      .then(() => {
        successToast(`댓글 수정이 완료되었습니다`);
        setIsEditing(false);
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
          onChange={(e) => updatedContent(e.target.value)}
        />
        <Stack>
          <Button
            onClick={() => {
              handleClickSave(boardComment.id);
            }}
          >
            저장
          </Button>
          <Button onClick={() => setIsEditing(false)}>취소</Button>
        </Stack>
      </Flex>
    </Box>
  );
}
