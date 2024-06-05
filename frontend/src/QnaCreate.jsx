import {Box, Button, Center, FormHelperText, Input, InputGroup, InputRightElement, Textarea} from "@chakra-ui/react";

export function QnaCreate() {
  return <Box>
    <Box mt={5}>제목</Box>
      <Box mt={2}><Input placeholder="내용을 입력해주세요"></Input></Box>

    <InputGroup>
    <Box mt={8}>문의 상세내용</Box>
    <InputRightElement w={"80px"} mr={"10"}>
      <Button mt={8} size={"sm"}>첨부하기</Button>
    </InputRightElement>
    </InputGroup>
    <Box mt={4}><Textarea placeholder="내용을 입력해주세요"></Textarea></Box>

    <Center>
    <Button mt={3} colorScheme={"blue"} w={500}>문의하기</Button>
    </Center>
  </Box>;
}