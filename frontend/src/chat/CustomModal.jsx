import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const CustomModal = ({ isOpen, onClose, url, header, body, buttonContent }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/*{loading ? (*/}
          {/*  <Spinner />*/}
          {/*) : (*/}
          {/*  <div>{data ? JSON.stringify(data) : "No data available"}</div>*/}
          {/*)}*/}
          {url}
          {body}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            variant="outline"
            mr={3}
            // onClick={handleDelete}
            // isLoading={deleting}
          >
            {buttonContent}
          </Button>
          <Button colorScheme="gray" variant="outline" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
