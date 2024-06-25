import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Textarea,
} from "@chakra-ui/react";

export function FormFields({
  title,
  setTitle,
  category,
  setCategory,
  startPrice,
  setStartPrice,
  date,
  setDate,
  time,
  setTime,
  content,
  setContent,
}) {
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
      <Box mb={4}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            borderColor="gray.400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select
            placeholder="카테고리 선택"
            borderWidth="1px"
            borderColor="gray.400"
            borderRadius="md"
            _focus={{ borderColor: "blue.500" }}
            value={category}
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
      <Box mb={4}>
        <FormControl>
          <FormLabel>입찰 시작가</FormLabel>
          <InputGroup>
            <Input
              borderColor="gray.400"
              value={formattedPrice(startPrice)}
              onChange={(e) => handleIntegerNumber(e)}
            />
            <InputRightAddon>원</InputRightAddon>
          </InputGroup>
        </FormControl>
      </Box>
      <Box>
        <Flex mb={4}>
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
      </Box>
      <Box mb={4}>
        <FormControl>
          <FormLabel>상품 상세내용 (선택)</FormLabel>
          <Textarea
            resize={"none"}
            height={"300px"}
            borderColor="gray.400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="상품 설명을 입력하세요."
          />
        </FormControl>
      </Box>
    </Box>
  );
}
