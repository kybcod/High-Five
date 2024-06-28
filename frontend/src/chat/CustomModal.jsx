import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomModal = ({
  isOpen,
  onClose,
  url,
  method,
  header,
  body,
  buttonContent,
}) => {
  const [processing, setProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const axiosRequest = {
    put: async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.put(url);
        onClose();
        toast({
          title: "신고하기 완료",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        console.log("Response:", response.data);
      } catch (error) {
        onClose();
        toast({
          title: "신고하기 실패",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    delete: async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.delete(url);
        setProcessing(false);
        onClose();
        toast({
          title: "채팅방 나가기 완료",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        console.log("Response:", response.data);
        navigate(-1);
      } catch (error) {
        onClose();
        toast({
          title: "채팅방 나가기 실패",
          status: "error",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        console.error("Error:", error);
        setProcessing(false);
      } finally {
        setIsLoading(false);
      }
    },
  };

  const handelAction = () => {
    setProcessing(true);
    axiosRequest[method](url, body); // bodyData 추가 예정
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            colorScheme={
              method === "delete" || method === "put" ? "red" : "teal"
            }
            variant="outline"
            mr={3}
            hidden={method === "get"}
            onClick={handelAction}
          >
            {buttonContent}
          </Button>
          <Button
            size="sm"
            colorScheme="gray"
            variant="outline"
            onClick={onClose}
          >
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
