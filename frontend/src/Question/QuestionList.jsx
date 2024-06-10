import {
  Box,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export function QuestionList() {
  const [questionList, setQuestionList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/question/list`).then((res) => setQuestionList(res.data));
  }, []);
  return (
    <Box>
      <Box mt={5} mb={5}>
        <Heading>문의 게시판</Heading>
      </Box>
      <Box mb={10}>
        <Table>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>제목</Th>
              <Th>작성자</Th>
              <Th>작성시간</Th>
            </Tr>
          </Thead>
          <Tbody>
            {questionList.map((question) => (
              <Tr
                _hover={{ bgColor: "gray.300" }}
                cursor={"pointer"}
                onClick={() => navigate(`/question/${question.id}`)}
                key={question.id}
              >
                <Td>{question.id}</Td>
                <Td>{question.title}</Td>
                <Td>{question.nickName}</Td>
                <Td>{question.inserted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
