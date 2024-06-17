import { Button, Flex, Input, Textarea } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export function CommentEdit({ comment }) {
  const navigate = useNavigate();
  function handleSaveClick() {
    return console.log("저장 버튼 누름");
  }

  return (
    <>
      <Flex gap={3}>
        <input value={comment.userId === 30 ? "관리자" : comment.userId} />
        <Textarea defaultValue={comment.content} />
        <>
          <Button onClick={handleSaveClick}>저장</Button>
          <Button onClick={navigate(`/question/${comment.questionId}`)}>
            취소
          </Button>
        </>
      </Flex>
    </>
  );
}
