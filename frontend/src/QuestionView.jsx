import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function QuestionView() {
  const { id } = useParams();
  const [question, setQuestion] = useState([]);

  useEffect(() => {
    axios.get(`/api/question/${id}`).then((res) => setQuestion(res.data));
  }, []);

  function handleEditClick() {
    return null;
  }

  return (
    <Box>
      <Box>
        <Box mt={2}>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={question.title} readOnly></Input>
          </FormControl>
        </Box>

        <Box mt={2}>
          <Flex justify={"space-between"}>
            <Box w="10%">작성자</Box>
            <Input w="30%" value={question.nickName} readOnly />
            <Box w="10%">작성시간</Box>
            <Input w="30%" value={question.inserted} readOnly />
          </Flex>
        </Box>

        <Box mt={5}>
          <FormControl>
            <FormLabel>문의 상세내용</FormLabel>
          </FormControl>
        </Box>
        <Box mt={4}>
          <Textarea value={question.content} readOnly></Textarea>
        </Box>
        <Box>
          <Flex justify={"flex-end"} mr={10}>
            <Button mt={5} onClick={handleEditClick} colorScheme={"teal"}>
              수정하기
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
