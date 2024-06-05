import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";

export function ProductUpload() {
  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>상품 이미지</FormLabel>
          <Input type={"file"} multiple />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select placeholder="카테고리 선택">
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
          <Input />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>입찰가 단위</FormLabel>
          <Input />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>입찰 마감 시간</FormLabel>
          <Input type={"datetime-local"} />
        </FormControl>
      </Box>
      <Box>
        <FormControl>
          <FormLabel>상품 상세내용</FormLabel>
          <Textarea placeholder={"상품에 대한 정보 작성해주세요."} />
        </FormControl>
      </Box>
    </Box>
  );
}
