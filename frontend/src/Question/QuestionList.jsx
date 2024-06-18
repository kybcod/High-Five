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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchType, setSearchType] = useState("titleNick");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/question/list?${searchParams}`).then((res) => {
      setQuestionList(res.data.content);
      setPageInfo(res.data.pageInfo);
    });
    setSearchType("titleNick");
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

  // 페이지 체크
  console.log("page", searchParams.get("page"));

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
  }

  function handleParamClick() {
    navigate(`/question/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  return (
    <Box>
      <Box mt={5} mb={5}>
        <Heading onClick={() => navigate("/question/list")} cursor={"pointer"}>
          문의 게시판
        </Heading>
      </Box>
      <Box mb={7}>
        <Table>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>제목</Th>
              <Th>작성자</Th>
              <Th>조회수</Th>
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
                <Td>{question.numberOfCount}</Td>
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
              <option value={"titleNick"}>제목+작성자</option>
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
            <Button onClick={handleParamClick}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Box>
        </Flex>
      </Center>

      <Center>
        <Flex gap={1}>
          <Tooltip label="맨 앞 페이지" placement="bottom">
            <Button onClick={() => handlePageButtonClick(1)}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </Button>
          </Tooltip>
          {pageInfo.prevPageNumber && (
            <>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <Button
              onClick={() => handlePageButtonClick(pageNumber)}
              key={pageNumber}
              colorScheme={
                pageNumber === pageInfo.currentPageNumber ? "blue" : "gray"
              }
            >
              {pageNumber}
            </Button>
          ))}

          {pageInfo.nextPageNumber && (
            <>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
            </>
          )}
          <Tooltip label="맨 끝 페이지" placement="bottom">
            <Button
              onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </Button>
          </Tooltip>
        </Flex>
      </Center>

      <Box>
        <Flex justify={"flex-end"} mr={10}>
          <Button
            colorScheme={"blue"}
            onClick={() => navigate("/question/write")}
          >
            글쓰기
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
