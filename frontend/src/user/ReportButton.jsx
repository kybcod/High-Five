import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

function ReportButton({ userId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { errorToast, successToast } = CustomToast();

  function handleReport() {
    axios
      .put(`/api/users/black/${userId}`)
      .then(() => successToast("신고처리 되었습니다"))
      .catch(() => errorToast("회원 신고 중 문제가 발생했습니다"))
      .finally(() => onClose());
  }

  return (
    <Box>
      <Button
        fontSize={"smaller"}
        width={"90px"}
        variant={"outline"}
        borderWidth={2}
        colorScheme="red"
        leftIcon={<FontAwesomeIcon icon={faExclamationTriangle} />}
        onClick={onOpen}
      >
        신고하기
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>신고하시겠습니까?</ModalHeader>
          <ModalBody>허위 신고 적발 시 불이익을 받게됩니다</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleReport}>신고</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ReportButton;
