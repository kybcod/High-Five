// ModalComponent.jsx
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
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export function ModalComponent({
  isOpen,
  onClose,
  onClick,
  isLoading,
  loadingText,
  header,
  body,
  confirmText,
  colorScheme,
  icon,
  cancelText,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalBody>{body}</ModalBody>
        <ModalFooter>
          <Button
            mr={3}
            onClick={onClick}
            colorScheme={colorScheme}
            leftIcon={<FontAwesomeIcon icon={icon} />}
            isLoading={isLoading}
            loadingText={loadingText}
          >
            {confirmText}
          </Button>
          <Button
            mr={3}
            onClick={onClose}
            leftIcon={<FontAwesomeIcon icon={faTimes} />}
          >
            {cancelText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
