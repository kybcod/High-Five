import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export function ProductUpload() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [endTime, setEndTime] = useState(null);
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreView] = useState([]);
  const [content, setContent] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleSaleClick() {
    if (files.length === 0) {
      toast({
        status: "warning",
        description: "파일을 업로드 해주세요.",
        position: "top-right",
        duration: 1000,
      });
      return;
    }

    if (!title) {
      toast({
        status: "warning",
        description: "제목을 입력해주세요.",
        position: "top-right",
        duration: 1000,
      });
      return;
    }

    if (!category) {
      toast({
        status: "warning",
        description: "카테고리를 선택해주세요.",
        position: "top-right",
        duration: 1000,
      });
      return;
    }

    if (!startPrice) {
      toast({
        status: "warning",
        description: "입찰 시작가를 입력해주세요.",
        position: "top-right",
        duration: 1000,
      });
      return;
    }

    if (!endTime) {
      toast({
        status: "warning",
        description: "입찰 마감 시간을 입력해주세요.",
        position: "top-right",
        duration: 1000,
      });
      return;
    }

    axios
      .postForm("/api/products", {
        title,
        category,
        startPrice,
        endTime,
        content,
        files,
      })
      .then(() => {
        toast({
          description: "새 상품이 등록되었습니다. 지금부터 판매 시작합니다.",
          status: "success",
          position: "top-right",
          duration: 1000,
        });
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 413) {
          toast({
            status: "error",
            description: `파일이 너무 큽니다. 다른 파일을 선택해주세요.`,
            position: "top-right",
          });
        }
      });
  }

  function handleRemoveFile(fileName) {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.name !== fileName);
      return newFiles;
    });

    setFilePreView((prevPreviews) => {
      const newPreviews = prevPreviews.filter(
        (filePreview) => filePreview.key !== fileName,
      );
      return newPreviews;
    });
  }

  function handleChangeFiles(e) {
    const fileList = Array.from(e.target.files);
    const updatedFiles = [...files, ...fileList]; // 기존 파일에 새 파일 추가
    setFiles(updatedFiles);

    const filePreviewList = updatedFiles.map((file) => (
      <Box mr={3} key={file.name} boxSize={"180px"} position="relative">
        <Image boxSize={"180px"} mr={2} src={URL.createObjectURL(file)} />
        <Button
          position="absolute"
          top={1}
          right={2}
          variant="ghost"
          onClick={() => handleRemoveFile(file.name)}
        >
          <FontAwesomeIcon icon={faCircleXmark} size="lg" />
        </Button>
      </Box>
    ));
    setFilePreView(filePreviewList);
  }

  const formattedPrice = (money) => {
    return money?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function handleIntegerNumber(e) {
    const formattedValue = e.target.value.replaceAll(",", "");
    if (!isNaN(formattedValue)) {
      setStartPrice(formattedValue);
    }
  }

  return (
    <Box>
      <Box>
        <Flex></Flex>
        <FormControl>
          <FormLabel>상품 이미지</FormLabel>
        </FormControl>
        <Flex>
          <Center>
            <FormLabel htmlFor="file-upload">
              <Box
                boxSize={"180px"}
                border={"1px dashed gray"}
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
                  onChange={(e) => handleChangeFiles(e)}
                />
              </Box>
            </FormLabel>
            <Center>{filePreview}</Center>
          </Center>
        </Flex>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select
            placeholder="카테고리 선택"
            onChange={(e) => setCategory(e.target.value)}
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
          <InputGroup>
            <Input
              value={formattedPrice(startPrice)}
              onChange={(e) => handleIntegerNumber(e)}
            />
            <InputRightAddon>원</InputRightAddon>
          </InputGroup>
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>입찰 마감 시간</FormLabel>
          <Input
            type={"datetime-local"}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>상품 상세내용</FormLabel>
          <Textarea
            whiteSpace={"pre-wrap"}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"상품에 대한 정보 작성해주세요."}
          />
        </FormControl>
      </Box>
      <Box>
        <Button onClick={handleSaleClick}>판매시작</Button>
      </Box>
    </Box>
  );
}
