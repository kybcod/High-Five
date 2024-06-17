import { Button, Flex, Input, Textarea, useToast } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CommentEdit } from "./CommentEdit.jsx";

export function Comment({ comment }) {
  const account = useContext(LoginContext);
  const toast = useToast();

  // Prop이 제대로 넘어오는지 확인하기 위해 콘솔 로그 추가
  useEffect(() => {
    console.log("Comment prop:", comment);
  }, [comment]);

  // comment id 넘겨주기
  function handleRemoveClick() {
    axios
      .delete(`/api/question/comment`, {
        data: { id: comment.id },
      })
      .then(() => {
        toast({
          status: "success",
          description: `댓글이 삭제 되었습니다.`,
          position: "bottom",
          duration: 2000,
        });
      })
      .catch((err) => {
        const code = err.response.status;
        if (code === 403) {
          toast({
            status: "error",
            description: `삭제 권한이 없습니다`,
            position: "bottom",
            duration: 2000,
          });
        }
        if (code === 404) {
          toast({
            status: "error",
            description: `id가 없습니다.`,
            position: "bottom",
            duration: 2000,
          });
        } else {
          toast({
            status: "error",
            description: `삭제되지 않았습니다`,
            position: "bottom",
            duration: 2000,
          });
        }
      })
      .finally();
  }

  function handleModifyclick() {
    console.log(`${comment.id}번 수정 버튼 클릭함`);
    return <CommentEdit comment={comment} />;
  }

  return (
    <>
      <Flex gap={3}>
        <input value={comment.userId === 30 ? "관리자" : comment.userId} />
        <Textarea value={comment.content} />
        <Input value={comment.inserted} />
        {account.hasAccess(comment.userId) && (
          <>
            <Button onClick={handleModifyclick}>수정</Button>
            <Button onClick={handleRemoveClick}>삭제</Button>
          </>
        )}
      </Flex>
    </>
  );
}
