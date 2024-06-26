import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
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
      <Box mb={10} display="flex">
        <FormLabel width="120px" pr={4} alignSelf="flex-start">
          카테고리
        </FormLabel>
        <FormControl flex="1">
          <RadioGroup
            colorScheme="blue"
            value={category}
            onChange={setCategory}
          >
            <Stack spacing={2}>
              <Flex align="center">
                <Radio mr={2} value="clothes">
                  의류
                </Radio>
                <Text fontSize="sm" color={"gray"}>
                  {" "}
                  아우터, 상의, 바지, 점프수트, 셋업/세트...
                </Text>
              </Flex>
              <Flex align="center">
                <Radio mr={2} value="goods">
                  잡화
                </Radio>
                <Text fontSize="sm" color={"gray"}>
                  책, 인형, 신발, 가방...
                </Text>
              </Flex>
              <Flex align="center">
                <Radio mr={2} value="food">
                  식품
                </Radio>
                <Text fontSize="sm" color={"gray"}>
                  과자, 음료수, 젤리, 초콜릿...
                </Text>
              </Flex>
              <Flex align="center">
                <Radio mr={2} value="digital">
                  디지털
                </Radio>
                <Text fontSize="sm" color={"gray"}>
                  휴대폰, 태블릿, 노트북, 카메라...
                </Text>
              </Flex>
              <Flex align="center">
                <Radio mr={2} value="sport">
                  스포츠
                </Radio>
                <Text fontSize="sm" color={"gray"}>
                  자전거, 골프용품, 축구공...
                </Text>
              </Flex>
              <Flex align="center">
                <Radio mr={2} value="e-coupon">
                  e-쿠폰
                </Radio>
                <Text fontSize="sm" color={"gray"}>
                  기프티콘, 상품권...
                </Text>
              </Flex>
            </Stack>
          </RadioGroup>
        </FormControl>
      </Box>
      <Box mb={10} display="flex">
        <FormLabel width="120px" pr={4} alignSelf="flex-start">
          상품명
        </FormLabel>
        <FormControl flex="1">
          <Input
            borderColor="gray.400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box mb={10} display="flex">
        <FormLabel width="120px" pr={4} alignSelf="flex-start">
          입찰 시작가
        </FormLabel>
        <FormControl flex="1">
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
      <Box mb={10} display="flex">
        <FormLabel width="120px" pr={4} alignSelf="flex-start">
          경매 마감 시간
        </FormLabel>
        <FormControl flex="1">
          <Flex>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              borderWidth="1px"
              borderColor="gray.400"
              borderRadius="md"
              _focus={{ borderColor: "blue.500" }}
              mr={4}
            />
            <Select
              placeholder="시간 선택"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              borderWidth="1px"
              borderColor="gray.400"
              borderRadius="md"
              _focus={{ borderColor: "blue.500" }}
            >
              {/* Options omitted for brevity */}
            </Select>
          </Flex>
        </FormControl>
      </Box>
      <Box mb={10} display="flex">
        <FormLabel width="120px" pr={4} alignSelf="flex-start">
          상품 상세내용 (선택)
        </FormLabel>
        <FormControl flex="1">
          <Textarea
            resize={"none"}
            height={"300px"}
            borderColor="gray.400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="개인정보(전화번호, SNS 계정 등)는 기재하지 말아주세요."
          />
        </FormControl>
      </Box>
    </Box>
  );
}
