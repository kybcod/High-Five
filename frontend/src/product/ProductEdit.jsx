import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  Image,
  Input,
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
  faTimesCircle,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
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
  const updateModal = useDisclosure();
  const deleteModal = useDisclosure();
  const fileInputRef = useRef(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
  }, [id]);

  function handleUpdateClick() {
    const localDate = new Date(`${date}T${time}`);
    const currentDateTime = new Date();
    if (localDate < currentDateTime) {
      toast({
        status: "warning",
        description:
          "선택한 시간이 현재 시간보다 이전입니다. 다시 선택해주세요.",
        position: "top-right",
        duration: 3000,
      });
      setUpdateLoading(false);
      return;
    }

    localDate.setHours(localDate.getHours() + 9);
    const formattedEndTime = localDate.toISOString().slice(0, -5);

    setUpdateLoading(true);

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
        setUpdateLoading(false);
      });
  }

  function handleDeleteClick() {
    setDeleteLoading(true);
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
        setDeleteLoading(false);
        navigate("/");
      });
  }

  if (product === null) {
    return <Spinner />;
  }

  function handleChangeFiles(e) {
    const newSelectedFiles = Array.from(e.target.files);
    setNewFileList([...newFileList, ...newSelectedFiles]);
    const newPreviews = newSelectedFiles.map((file, index) => {
      const uniqueKey = `${index}-${file.name}`;
      return { src: URL.createObjectURL(file), key: uniqueKey };
    });
    setNewFilePreviews([...newFilePreviews, ...newPreviews]);

    // 파일 인풋 초기화(같은 파일 선택 시 초기화)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveExistingFile(index) {
    setRemovedFileList([
      ...removedFileList,
      existingFilePreviews[index].fileName,
    ]);
    setExistingFilePreviews(existingFilePreviews.filter((_, i) => i !== index));
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
      <Box mb={4}>
        <Grid templateColumns="180px 1fr" gap={4}>
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
              minW="180px"
              minH="180px"
            >
              <Box mb={2}>
                <FontAwesomeIcon icon={faCamera} size="2xl" />
              </Box>
              <Box>이미지 등록</Box>
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

          <Grid templateColumns="repeat(auto-fill, 180px)" gap={4}>
            {/* 기존 이미지 표시 */}
            {existingFilePreviews.map((file, index) => {
              const uniqueKey = `${index}-${file.fileName}`;
              return (
                <Box
                  key={uniqueKey}
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
                    onClick={() => handleRemoveExistingFile(index)}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                  </Button>
                </Box>
              );
            })}

            {/* 새로운 파일 선택 시 미리보기 표시 */}
            {newFilePreviews.map((preview, index) => (
              <Box
                key={preview.key}
                position="relative"
                mr={3}
                minWidth="180px"
              >
                <Image boxSize="180px" src={preview.src} mr={2} />
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
          </Grid>
        </Grid>
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
        >
          수정
        </Button>
        <Button onClick={deleteModal.onOpen} w={"100%"} colorScheme="red">
          삭제
        </Button>
      </Flex>

      {/* 수정 모달 */}
      <ModalComponent
        isOpen={updateModal.isOpen}
        onClose={updateModal.onClose}
        onClick={handleUpdateClick}
        isLoading={updateLoading}
        loadingText="처리중"
        header="수정하기"
        body="정말로 수정하시겠습니까?"
        confirmText="확인"
        colorScheme="blue"
        icon={faCheck}
        cancelText="취소"
      />

      {/* 삭제 모달 */}
      <ModalComponent
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onClick={handleDeleteClick}
        isLoading={deleteLoading}
        loadingText="처리중"
        header="삭제하기"
        body="정말로 삭제하시겠습니까?"
        confirmText="확인"
        colorScheme="red"
        icon={faTrashAlt}
        cancelText="취소"
      />
    </Box>
  );
}
