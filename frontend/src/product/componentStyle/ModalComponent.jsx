// ModalComponent.jsx

import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

export const ModalComponent = ({
  isOpen,
  onClose,
  headerText,
  bodyText,
  onClick,
  colorScheme,
  okButtonText,
  cancelButtonText,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{headerText}</ModalHeader>
        <ModalBody>{bodyText}</ModalBody>
        <ModalFooter>
          {/*확인 버튼*/}
          <Button
            mr={3}
            onClick={onClick}
            colorScheme={colorScheme}
            leftIcon={
              colorScheme === "blue" ? (
                <FontAwesomeIcon icon={faCheck} />
              ) : (
                <FontAwesomeIcon icon={faTrashAlt} />
              )
            }
            isLoading={isLoading}
            loadingText={"처리중"}
          >
            {okButtonText}
          </Button>

          {/*취소 버튼*/}
          <Button
            mr={3}
            onClick={onClose}
            leftIcon={<FontAwesomeIcon icon={faTimes} />}
          >
            {cancelButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
