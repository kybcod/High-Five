import {
  Box,
  Button,
  Flex,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCamera,
  faCheck,
  faTimes,
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormFields } from "./FormFields.jsx";

export function ProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [existingFilePreviews, setExistingFilePreviews] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [newFileList, setNewFileList] = useState([]);
  const [removedFileList, setRemovedFileList] = useState([]);
  const toast = useToast();
  const updateModal = useDisclosure();
  const deleteModal = useDisclosure();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => {
      console.log(res.data);
      setProduct(res.data.product);
      setExistingFilePreviews(res.data.product.productFileList);

      const endTime = res.data.product.endTime;
      const [datePart, timePart] = endTime.split("T");
      setDate(datePart);
      setTime(timePart.slice(0, 5));
    });
  }, []);

  function handleUpdateClick() {
    const localDate = new Date(`${date}T${time}`);
    localDate.setHours(localDate.getHours() + 9);
    const formattedEndTime = localDate.toISOString().slice(0, -5);

    setLoading(true);

    axios
      .putForm("/api/products", {
        id: product.id,
        title: product.title,
        category: product.category,
        endTime: formattedEndTime,
        startPrice: product.startPrice,
        content: product.content,
        removedFileList,
        newFileList,
      })
      .then(() => {
        toast({
          status: "success",
          description: "해당 상품 정보가 수정되었습니다.",
          position: "top-right",
          duration: 1000,
        });
        navigate("/");
      })
      .catch((err) => {
        toast({
          status: "error",
          description: "수정되지 않았습니다. 작성한 내용을 다시 확인해주세요.",
          position: "top-right",
          duration: 1000,
        });
      })
      .finally(() => {
        updateModal.onClose();
        setLoading(false);
      });
  }

  function handleDeleteClick() {
    setLoading(true);
    axios
      .delete(`/api/products/${id}`)
      .then(() =>
        toast({
          status: "info",
          description: "해당 상품이 삭제되었습니다.",
          position: "top-right",
          duration: 1000,
        }),
      )
      .catch((err) => {
        toast({
          status: "warning",
          description: "삭제되지 않았습니다. 다시 확인해주세요.",
          position: "top-right",
          duration: 1000,
        });
      })
      .finally(() => {
        deleteModal.onClose();
        setLoading(false);
      });
  }

  if (product === null) {
    return <Spinner />;
  }

  function handleChangeFiles(e) {
    const newSelectedFiles = Array.from(e.target.files);
    setNewFileList([...newFileList, ...newSelectedFiles]);
    const newPreviews = newSelectedFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setNewFilePreviews([...newFilePreviews, ...newPreviews]);

    // 파일 인풋 초기화(같은 파일 선택 시 초기화)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveExistingFile(fileName) {
    setRemovedFileList([...removedFileList, fileName]);
    setExistingFilePreviews(
      existingFilePreviews.filter((file) => file.fileName !== fileName),
    );
  }

  function handleRemoveNewFile(index) {
    const updatedNewFiles = [...newFileList];
    const updatedNewFilePreviews = [...newFilePreviews];
    updatedNewFiles.splice(index, 1);
    updatedNewFilePreviews.splice(index, 1);
    setNewFileList(updatedNewFiles);
    setNewFilePreviews(updatedNewFilePreviews);
  }

  return (
    <Box p={4} mx="auto" maxWidth="600px">
      <Box mb={4}>
        <Flex alignItems="center">
          <FormLabel htmlFor="file-upload">
            <Box
              border="1px dashed gray"
              textAlign="center"
              cursor="pointer"
              _hover={{ borderColor: "blue.500" }}
              mr={4}
              p={4}
              rounded="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Box mb={2}>
                <FontAwesomeIcon icon={faCamera} size="2xl" />
              </Box>
              <Box>Upload files</Box>
              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                multiple
                accept={"image/*"}
                style={{ display: "none" }}
                onChange={handleChangeFiles}
              />
            </Box>
          </FormLabel>

          <Flex overflowX="auto" flexWrap="nowrap" maxWidth="400px">
            {/* 기존 이미지 표시 */}
            {existingFilePreviews.map((file) => (
              <Box
                key={file.fileName}
                position="relative"
                mr={3}
                minWidth="180px"
              >
                <Image boxSize="180px" src={file.filePath} mr={2} />
                <Button
                  position="absolute"
                  top={1}
                  right={2}
                  variant="ghost"
                  onClick={() => handleRemoveExistingFile(file.fileName)}
                >
                  <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                </Button>
              </Box>
            ))}
            {/* 새로운 파일 선택 시 미리보기 표시 */}
            {newFilePreviews.map((src, index) => (
              <Box key={index} position="relative" mr={3} minWidth="180px">
                <Image boxSize="180px" src={src} mr={2} />
                <Button
                  position="absolute"
                  top={1}
                  right={2}
                  variant="ghost"
                  onClick={() => handleRemoveNewFile(index)}
                >
                  <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                </Button>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>

      <FormFields
        title={product.title}
        setTitle={(title) => setProduct({ ...product, title: title })}
        category={product.category}
        setCategory={(category) =>
          setProduct({ ...product, category: category })
        }
        startPrice={product.startPrice}
        setStartPrice={(price) => setProduct({ ...product, startPrice: price })}
        date={date}
        setDate={setDate}
        time={time}
        setTime={setTime}
        content={product.content}
        setContent={(content) => setProduct({ ...product, content: content })}
      />

      <Flex justifyContent="space-between">
        <Button
          onClick={updateModal.onOpen}
          w={"100%"}
          mr={4}
          colorScheme={"green"}
          isLoading={loading}
        >
          수정
        </Button>
        <Button onClick={deleteModal.onOpen} w={"100%"} colorScheme="red">
          삭제
        </Button>
      </Flex>

      {/* 수정 모달 */}
      <Modal isOpen={updateModal.isOpen} onClose={updateModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정하기</ModalHeader>
          <ModalBody>정말로 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={handleUpdateClick}
              colorScheme="blue"
              leftIcon={<FontAwesomeIcon icon={faCheck} />}
              isLoading={false}
              loadingText={"처리중"}
            >
              확인
            </Button>
            <Button
              mr={3}
              onClick={updateModal.onClose}
              leftIcon={<FontAwesomeIcon icon={faTimes} />}
              isLoading={false}
              loadingText={"처리중"}
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 삭제 모달 */}
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제하기</ModalHeader>
          <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={handleDeleteClick}
              colorScheme="red"
              leftIcon={<FontAwesomeIcon icon={faTrashAlt} />}
              isLoading={loading}
              loadingText={"처리중"}
            >
              확인
            </Button>
            <Button
              mr={3}
              onClick={deleteModal.onClose}
              leftIcon={<FontAwesomeIcon icon={faTimes} />}
              isLoading={loading}
              loadingText={"처리중"}
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
