import {
  Box,
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
import { CommentWrite } from "./CommentWrite.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export function Comment({ comment }) {
  const account = useContext(LoginContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);

  // Prop이 제대로 넘어오는지 확인하기 위해 콘솔 로그 추가
  useEffect(() => {
    console.log("Comment prop:", comment);
  }, [comment]);

  // comment id 넘겨주기
  function handleRemoveClick() {
    axios
      .delete(`/api/question/comment/${comment.id}`)
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
    setIsEditing(true);
  }

  return (
    <>
      {isEditing ? (
        <CommentWrite comment={comment} />
      ) : (
        <Flex gap={3}>
          <Box>
            <FontAwesomeIcon icon={faUser} style={{ color: "#22c393" }} />
          </Box>
          <input value={comment.nickName} readOnly />
          <Textarea value={comment.content} readOnly />
          <Input value={comment.inserted} readOnly />
          {account.hasAccess(comment.userId) && (
            <>
              <Button onClick={handleModifyClick}>수정</Button>
              <Button onClick={onOpen}>삭제</Button>
            </>
          )}
        </Flex>
      )}

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
