import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { faCamera, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [existingFilePreviews, setExistingFilePreviews] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [newFileList, setNewFileList] = useState([]);
  const [removedFileList, setRemovedFileList] = useState([]);
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => {
      setProduct(res.data);
      setExistingFilePreviews(res.data.productFileList || []);
    });
  }, []);

  function handleUpdateClick() {
    axios
      .putForm("/api/products", {
        id: product.id,
        title: product.title,
        category: product.category,
        endTime: product.endTime,
        startPrice: product.startPrice,
        content: product.content,
        removedFileList,
        newFileList,
      })
      .then(() =>
        toast({
          status: "success",
          description: "해당 상품 정보가 수정되었습니다.",
          position: "top-right",
          duration: 1000,
        }),
      )
      .catch((err) => {
        toast({
          status: "error",
          description: "수정되지 않았습니다. 작성한 내용을 다시 확인해주세요.",
          position: "top-right",
          duration: 1000,
        });
      })
      .finally(() => {
        onClose();
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
    <Box>
      <Box>
        <FormControl>
          <FormLabel>상품 이미지</FormLabel>
        </FormControl>
        <Flex>
          <Center>
            <FormLabel htmlFor="file-upload">
              <Box
                boxSize={"180px"}
                border={"1px solid gray"}
                textAlign="center"
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FontAwesomeIcon icon={faCamera} size="2xl" />
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept={"image/*"}
                  style={{ display: "none" }}
                  onChange={handleChangeFiles}
                />
              </Box>
            </FormLabel>
            {/* 기존 이미지 표시 */}
            {existingFilePreviews.map((file) => (
              <Box boxSize={"180px"} key={file.fileName} position="relative">
                <Image boxSize={"150px"} src={file.filePath} mr={2} />
                <Button
                  position="absolute"
                  top={1}
                  right={2}
                  variant="ghost"
                  onClick={() => handleRemoveExistingFile(file.fileName)}
                >
                  <FontAwesomeIcon icon={faCircleXmark} size="lg" />
                </Button>
              </Box>
            ))}
            {/* 새로운 파일 선택 시 미리보기 표시 */}
            {newFilePreviews.map((src, index) => (
              <Box key={index} position="relative">
                <Image boxSize={"180px"} src={src} mr={2} />
                <Button
                  position="absolute"
                  top={1}
                  right={2}
                  variant="ghost"
                  onClick={() => handleRemoveNewFile(index)}
                >
                  <FontAwesomeIcon icon={faCircleXmark} size="lg" />
                </Button>
              </Box>
            ))}
          </Center>
        </Flex>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            defaultValue={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select
            defaultValue={product.category}
            onChange={(e) =>
              setProduct({ ...product, category: e.target.value })
            }
            placeholder="카테고리 선택"
          >
            <option value="clothes">의류</option>
            <option value="goods">잡화</option>
            <option value="food">식품</option>
            <option value="digital">디지털</option>
            <option value="sport">스포츠</option>
            <option value="e-coupon">e-쿠폰</option>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>입찰 시작가</FormLabel>
          <Input
            defaultValue={product.startPrice}
            onChange={(e) =>
              setProduct({ ...product, startPrice: e.target.value })
            }
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>입찰 마감 시간</FormLabel>
          <Input
            defaultValue={product.endTime}
            type={"datetime-local"}
            onChange={(e) =>
              setProduct({ ...product, endTime: e.target.value })
            }
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>상품 상세내용</FormLabel>
          <Textarea
            defaultValue={product.content}
            whiteSpace={"pre-wrap"}
            onChange={(e) =>
              setProduct({ ...product, content: e.target.value })
            }
            placeholder={"상품에 대한 정보 작성해주세요."}
          />
        </FormControl>
      </Box>
      <Flex>
        <Box>
          <Button onClick={onOpen}>수정</Button>
        </Box>
        <Box>
          <Button>삭제</Button>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>정말로 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={handleUpdateClick}>확인</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
