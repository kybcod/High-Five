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
import { useNavigate, useParams } from "react-router-dom";

export function QuestionView() {
  const { id } = useParams();
  const [question, setQuestion] = useState([]);
  const navigate = useNavigate();

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
          <Box mt={5}>
            {question.fileList &&
              question.fileList.map((file) => (
                <Card m={3} key={file.name}>
                  <CardBody>
                    <Image w={"600px"} src={file.src} />
                  </CardBody>
                </Card>
              ))}
          </Box>
        </Box>
        <Box>
          <Flex justify={"flex-end"} mr={10}>
            <Button mt={5} mr={2} onClick={handleEditClick}>
              수정
            </Button>
            <Button mt={5} onClick={handleEditClick}>
              삭제
            </Button>
          </Flex>
        </Box>
        <Center>
          <Button
            colorScheme={"teal"}
            w={"200px"}
            onClick={() => navigate("/questionList")}
          >
            글 목록
          </Button>
        </Center>
      </Box>
    </Box>
  );
}
