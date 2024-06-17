import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CommentEdit } from "./CommentEdit.jsx";
import { CommentWrite } from "./CommentWrite.jsx";

export function Comment({ comment }) {
  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        onClose();
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

  function handleModifyClick() {
    console.log(`${comment.id}번 수정 버튼 클릭함`);
    // return <CommentEdit comment={comment} />;
    return <CommentWrite />;
  }

  return (
    <>
      <Flex gap={3}>
        <input value={comment.userId === 30 ? "관리자" : comment.userId} />
        <Textarea value={comment.content} />
        <Input value={comment.inserted} />
        {account.hasAccess(comment.userId) && (
          <>
            <Button onClick={handleModifyClick}>수정</Button>
            <Button onClick={onOpen}>삭제</Button>
          </>
        )}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalBody>삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={onClose}>취소</Button>
              <Button colorScheme={"red"} onClick={handleRemoveClick}>
                확인
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
