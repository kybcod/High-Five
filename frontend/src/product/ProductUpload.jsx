import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ProductUpload() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startPrice, setStartPrice] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  function handleSaleClick() {
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
      });
  }

  const filePreview = Array.from(files).map((file, index) => (
    <Box key={index}>
      <Image boxSize={"180px"} mr={2} src={URL.createObjectURL(file)} />
    </Box>
  ));

  return (
    <Box>
      <Box>
        <Flex>
          <Center>{filePreview}</Center>
        </Flex>
        <FormControl>
          <FormLabel>상품 이미지</FormLabel>
          <Input
            type={"file"}
            multiple
            accept={"image/*"}
            onChange={(e) => setFiles(e.target.files)}
          />
        </FormControl>
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
          <Input onChange={(e) => setStartPrice(e.target.value)} />
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
