import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  StackDivider,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function QuestionEdit() {
  const [question, setQuestion] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/api/question/${id}`).then((res) => setQuestion(res.data));
  }, []);

  return (
    <Box>
      <Box mt={5}>
        <Heading>{id}번 문의 글 수정</Heading>
      </Box>
      <Box>
        <Box mt={2}>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input defaultValue={question.title}></Input>
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
            <Textarea defaultValue={question.content}></Textarea>
          </FormControl>
        </Box>

        <Box mb={7}>
          {question.fileList &&
            question.fileList.map((file) => (
              <Card m={1} key={file.name}>
                <CardFooter>
                  <Flex gap={3}>
                    <Box>
                      <FontAwesomeIcon color={"red"} icon={faTrashCan} />
                    </Box>
                    <Text>{file.name}</Text>
                  </Flex>
                </CardFooter>
                <CardBody>
                  <Image src={file.src} />
                </CardBody>
              </Card>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
