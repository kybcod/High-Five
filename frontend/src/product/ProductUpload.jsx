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
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreView] = useState([]);
  const [content, setContent] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleSaleClick() {
    if (!date || !time) {
      toast({
        status: "warning",
        description: "입찰 마감 시간을 입력해주세요.",
        position: "top-right",
        duration: 1000,
      });
      return;
    }

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

    const localDate = new Date(`${date}T${time}`);
    localDate.setHours(localDate.getHours() + 9);
    setEndTime(localDate.toISOString().slice(0, -5));

    axios
      .postForm("/api/products", {
        title: title,
        category: category,
        startPrice: startPrice,
        endTime: endTime,
        content: content,
        files: files,
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
        if (err.response && err.response.status === 413) {
          toast({
            status: "error",
            description: `파일이 너무 큽니다. 다른 파일을 선택해주세요.`,
            position: "top-right",
          });
        } else {
          toast({
            status: "error",
            description: `서버 오류가 발생했습니다. 다시 시도해주세요.`,
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
        <Flex spacing={3}>
          <FormControl>
            <FormLabel>날짜</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>시간 (24시간제)</FormLabel>
            <Select
              placeholder="시간"
              value={time}
              onChange={(e) => setTime(e.target.value)}
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
      </Box>
      <Box>
        <FormControl>
          <FormLabel>상품 설명</FormLabel>
          <Textarea
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품 설명을 입력하세요."
          />
        </FormControl>
      </Box>
      <Box textAlign="center">
        <Button
          mt={2}
          onClick={handleSaleClick}
          colorScheme="blue"
          align="center"
        >
          판매하기
        </Button>
      </Box>
    </Box>
  );
}
