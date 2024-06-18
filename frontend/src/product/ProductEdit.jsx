import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Textarea,
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

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setExistingFilePreviews(res.data.productFileList || []);

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
      });
  }

  function handleDeleteClick() {
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

  const formattedPrice = (money) => {
    return money?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function handleFormattedNumber(e) {
    const inputValue = e.target.value.replaceAll(",", "");
    // 숫자가 아닌 문자를 제외하고 필터링
    const filteredValue = inputValue.replace(/\D/g, "");

    setProduct({ ...product, startPrice: filteredValue });
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

      <FormControl mb={4}>
        <FormLabel>제목</FormLabel>
        <Input
          borderColor="gray.400"
          defaultValue={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>카테고리</FormLabel>
        <Select
          defaultValue={product.category}
          onChange={(e) => setProduct({ ...product, category: e.target.value })}
          placeholder="카테고리 선택"
          borderWidth="1px"
          borderColor="gray.400"
          borderRadius="md"
          _focus={{ borderColor: "blue.500" }}
        >
          <option value="clothes">의류</option>
          <option value="goods">잡화</option>
          <option value="food">식품</option>
          <option value="digital">디지털</option>
          <option value="sport">스포츠</option>
          <option value="e-coupon">e-쿠폰</option>
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>입찰 시작가</FormLabel>
        <InputGroup>
          <Input
            borderColor="gray.400"
            value={formattedPrice(product.startPrice)}
            onChange={handleFormattedNumber}
          />
          <InputRightAddon>원</InputRightAddon>
        </InputGroup>
      </FormControl>

      <Flex spacing={3}>
        <FormControl mr={4}>
          <FormLabel>날짜</FormLabel>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            borderWidth="1px"
            borderColor="gray.400"
            borderRadius="md"
            _focus={{ borderColor: "blue.500" }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>시간(AM 8:00 ~ PM 23:00)</FormLabel>
          <Select
            placeholder="시간"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            borderWidth="1px"
            borderColor="gray.400"
            borderRadius="md"
            _focus={{ borderColor: "blue.500" }}
          >
            <option value="08:00">08:00</option>
            <option value="09:00">09:00</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
            <option value="18:00">18:00</option>
            <option value="19:00">19:00</option>
            <option value="20:00">20:00</option>
            <option value="21:00">21:00</option>
            <option value="22:00">22:00</option>
            <option value="23:00">23:00</option>
          </Select>
        </FormControl>
      </Flex>

      <FormControl mb={4}>
        <FormLabel>상품 상세내용</FormLabel>
        <Textarea
          borderColor="gray.400"
          defaultValue={product.content}
          onChange={(e) => setProduct({ ...product, content: e.target.value })}
          placeholder="상품에 대한 정보를 작성해주세요."
        />
      </FormControl>

      <Flex justifyContent="space-between">
        <Button
          onClick={updateModal.onOpen}
          w={"100%"}
          mr={4}
          colorScheme={"green"}
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
            >
              확인
            </Button>
            <Button
              mr={3}
              onClick={updateModal.onClose}
              leftIcon={<FontAwesomeIcon icon={faTimes} />}
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
            >
              확인
            </Button>
            <Button
              mr={3}
              onClick={deleteModal.onClose}
              leftIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
