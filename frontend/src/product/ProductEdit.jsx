import {
  Box,
  Button,
  Flex,
  FormLabel,
  Image,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { faCamera, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormFields } from "./componentStyle/FormFields.jsx";
import { ModalComponent } from "./componentStyle/ModalComponent.jsx";

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
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [updateModal, setUpdateModal] = useState({ isOpen: false });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });
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
        // deleteModal.onClose();
        setDeleteModal({ isOpen: false });
        setLoading(false);
        navigate("/");
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

      <Box>
        {/* 수정 Modal */}
        <ModalComponent
          isOpen={updateModal.isOpen}
          onClose={() => setUpdateModal({ isOpen: false })}
          headerText="수정하기"
          bodyText="정말로 수정하시겠습니까?"
          onClick={handleUpdateClick}
          colorScheme="blue"
          okButtonText="확인"
          cancelButtonText="취소"
          isLoading={loading}
        />

        {/* 삭제 Modal */}
        <ModalComponent
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          headerText="삭제하기"
          bodyText="정말로 삭제하시겠습니까?"
          onClick={handleDeleteClick}
          colorScheme="red"
          okButtonText="확인"
          cancelButtonText="취소"
          isLoading={loading}
        />

        <Flex justifyContent="space-between">
          <Button
            w={"100%"}
            mr={4}
            colorScheme={"green"}
            onClick={() => setUpdateModal({ isOpen: true })}
          >
            수정
          </Button>
          <Button
            w={"100%"}
            mr={4}
            colorScheme={"red"}
            onClick={() => setDeleteModal({ isOpen: true })}
          >
            삭제
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
