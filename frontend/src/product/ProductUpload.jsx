import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export function ProductUpload() {
  const [prodcutList, setProdcutList] = useState([]);
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startPrice, setStartPrice] = useState(0);
  const [endPrice, setEndPrice] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [productFiles, setProductFiles] = useState([]);
  const [content, setContent] = useState("");
  const toast = useToast();

  function handleSaleClick() {
    axios
      .postForm("/api/products", {
        id,
        title,
        category,
        startPrice,
        endPrice,
        endTime,
        productFiles,
        content,
      })
      .then(() => {
        toast({
          description: "새 상품이 등록되었습니다. 지금부터 판매 시작합니다.",
          status: "success",
          position: "top-right",
          duration: 1000,
        });
      });
  }

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>상품 이미지</FormLabel>
          <Input
            type={"file"}
            multiple
            onChange={(e) => setProductFiles(e.target.files)}
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
            <option value="option2">잡화</option>
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
