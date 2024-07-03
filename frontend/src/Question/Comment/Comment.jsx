import {
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { CommentWrite } from "./CommentWrite.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faUser } from "@fortawesome/free-solid-svg-icons";
import { CustomToast } from "../../component/CustomToast.jsx";

export function Comment({ comment, setIsProcessing }) {
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
            <Spacer />
            {account.hasAccess(comment.userId) && (
              <>
                <Menu>
                  <MenuButton>
                    <FontAwesomeIcon icon={faEllipsisVertical} size={"lg"} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={handleModifyClick}>수정</MenuItem>
                    <MenuItem onClick={onOpen}>삭제</MenuItem>
                  </MenuList>
                </Menu>
              </>
            )}
          </Flex>
          <Box whiteSpace="pre" mt={3} mb={3}>
            {comment.content}
          </Box>
          <Flex gap={3}>
            <Box mt={3} whiteSpace="pre" style={{ color: "grey" }}>
              {comment.inserted}
            </Box>
          </Flex>
        </>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Image src={"/img/warning.png"} boxSize={"30px"} />
          </ModalHeader>
          <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={handleRemoveClick} colorScheme={"red"}>
                확인
              </Button>
              <Button onClick={onClose}>취소</Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
