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
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { CommentWrite } from "./CommentWrite.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { CustomToast } from "../../component/CustomToast.jsx";

export function Comment({ comment, isProcessing, setIsProcessing }) {
  const account = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const { successToast, errorToast } = CustomToast();

  function handleRemoveClick() {
    setIsProcessing(true);
    axios
      .delete(`/api/question/comment/${comment.id}`)
      .then(() => {
        successToast("댓글이 삭제 되었습니다");
      })
      .catch((err) => {
        err.response.status === 403
          ? errorToast("삭제 권한이 없습니다")
          : err.response.status === 404
            ? errorToast("id가 없습니다")
            : errorToast("삭제되지 않았습니다.");
      })
      .finally(() => {
        setIsProcessing(false);
        onClose();
      });
  }

  function handleModifyClick() {
    setIsEditing(true);
  }

  return (
    <>
      {isEditing ? (
        <CommentWrite
          comment={comment}
          setIsEditing={setIsEditing}
          setIsProcessing={setIsProcessing}
        />
      ) : (
        <>
          <Flex gap={3} mb={3}>
            <Box>
              <FontAwesomeIcon icon={faUser} style={{ color: "#44af8f" }} />
            </Box>
            <Box
              whiteSpace="pre"
              style={{
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              {comment.nickName}
            </Box>
          </Flex>
          <Box whiteSpace="pre" mt={3} mb={3}>
            {comment.content}
          </Box>
          <Flex gap={3}>
            <Box mt={3} whiteSpace="pre" style={{ color: "grey" }}>
              {comment.inserted}
            </Box>
            {account.hasAccess(comment.userId) && (
              <>
                <Button onClick={handleModifyClick}>수정</Button>
                <Button onClick={onOpen} isLoading={isProcessing}>
                  삭제
                </Button>
              </>
            )}
          </Flex>
        </>
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
