import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

export function QuestionList() {
  const [questionList, setQuestionList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("titleNickName");
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    axios.get(`/api/question/list`).then((res) => {
      setQuestionList(res.data.questionList);
      setPageInfo(res.data.pageInfo);
    });
    setSearchType("titleNickName");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }
  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <Box mt={5} mb={5}>
        <Heading>문의 게시판</Heading>
      </Box>
      <Box mb={7}>
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

      <Center mb={3}>
        <Flex gap={2}>
          <Box>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value={"titleNickName"}>제목+작성자</option>
              <option value={"title"}>제목</option>
              <option value={"nickName"}>작성자</option>
            </Select>
          </Box>
          <Box>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholer={"검색어"}
            />
          </Box>
          <Box>
            <Button onClick={handlePageButtonClick}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Box>
        </Flex>
      </Center>

      <Center>
        <Box mt={3}>
          {pageInfo.prevPageNumber && (
            <>
              <Button mr={"10px"} onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                mr={"10px"}
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}
        </Box>
      </Center>

      {pageNumbers.map((pageNumber) => {
        <Button
          onClick={handlePageButtonClick(pageNumber)}
          colorScheme={
            pageNumber == pageInfo.currentPageNumber ? "teal" : "gray"
          }
          key={pageNumber}
        >
          {pageNumber}
        </Button>;
      })}

      {pageInfo.nextPageNumber && (
        <>
          <Button
            onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
          <Button
            onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
          >
            <FontAwesomeIcon icon={faAnglesRight} />
          </Button>
        </>
      )}

      <Box>
        <Flex justify={"flex-end"} mr={10}>
          <Button colorScheme={"blue"} onClick={() => navigate("/question")}>
            글쓰기
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
