import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Image,
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
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faImage,
  faLock,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function QuestionList() {
  const [questionList, setQuestionList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("titleNick");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

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

  // 페이지 번호를 계산하는 함수
  const getPageNumber = (index) => {
    return (
      pageInfo.totalPostNumber - ((pageInfo.currentPageNumber - 1) * 10 + index)
    );
  };

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
  }

  function handleParamClick() {
    navigate(`/question/list?type=${searchType}&keyword=${searchKeyword}`);
  }

  const handleSecretTextClick = (question) => {
    if (
      question.secretWrite &&
      !account.isAdmin(account.userId) &&
      !account.hasAccess(question.userId)
    ) {
      alert("비밀글에 접근할 권한이 없습니다.");
    } else {
      navigate(`/question/${question.id}`);
    }
  };

  return (
    <>
      <Box mb={7}>
        {questionList.length === 0 && (
          <Center m={20}>조회 결과가 없습니다.</Center>
        )}
        {questionList.length > 0 && (
          <Box mt={10} w="92%" mx="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>No.</Th>
                  <Th textAlign="center">답변상태</Th>
                  <Th>제목</Th>
                  <Th textAlign="center">작성자</Th>
                  <Th textAlign="center">조회수</Th>
                  <Th textAlign="center">작성일시</Th>
                </Tr>
              </Thead>
              <Tbody>
                {questionList.map((question, index) => (
                  <Tr
                    _hover={{ bgColor: "gray.300" }}
                    cursor={"pointer"}
                    onClick={() => handleSecretTextClick(question)}
                    key={question.id}
                    fontSize={"sm"}
                  >
                    <Td width="8%">{getPageNumber(index)}</Td>
                    <Td width="12%" textAlign="center">
                      {question.numberOfComments > 0 ? (
                        <Box ml={2}>
                          <Badge variant="outline" colorScheme="green">
                            답변완료
                          </Badge>
                        </Box>
                      ) : (
                        <Box ml={2}>
                          <Badge variant="outline">답변대기</Badge>
                        </Box>
                      )}
                    </Td>
                    <Td width="42%" fontSize={"15px"} whiteSpace={"wrap"}>
                      <Flex gap={2}>
                        <Flex gap={3}>
                          {/*<Image src={"/img/lock.svg"} />*/}
                          <FontAwesomeIcon
                            icon={faLock}
                            style={{ marginRight: "4px" }}
                          />
                          <span style={{ color: "gray", fontSize: "14px" }}>
                            비밀글
                          </span>
                        </Flex>
                        ){question.secretWrite || question.title}
                        {question.isNewBadge && (
                          <Badge colorScheme="green">New</Badge>
                        )}
                        {question.numberOfFiles > 0 && (
                          <Badge ml={1} variant={"outline"} w={"35px"}>
                            <Flex justifyContent={"center"}>
                              <Box>
                                <FontAwesomeIcon icon={faImage} />
                              </Box>
                              <Box ml={1}>{question.numberOfFiles}</Box>
                            </Flex>
                          </Badge>
                        )}
                        {question.numberOfComments > 0 && (
                          <Box
                            style={{
                              color: "#ff354d",
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.8rem",
                              fontWeight: "600",
                            }}
                          >
                            +{question.numberOfComments}
                          </Box>
                        )}
                      </Flex>
                    </Td>
                    <Td width="12%" textAlign="center">
                      {question.nickName}
                    </Td>
                    <Td width="10%" textAlign="center" fontSize={"sm"}>
                      {question.numberOfCount}
                    </Td>
                    <Td width="15%" textAlign="center" fontSize={"sm"}>
                      {question.inserted}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {account.isLoggedIn() && (
        <Flex justify={"flex-end"} mr={20}>
          <Button
            colorScheme={"teal"}
            variant={"outline"}
            onClick={() => navigate("/question/write")}
          >
            글쓰기
          </Button>
        </Flex>
      )}

      <Center mb={10}>
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
            <Button onClick={() => handlePageButtonClick(1)} variant="outline">
              <FontAwesomeIcon icon={faAnglesLeft} />
            </Button>
          </Tooltip>
          {pageInfo.prevPageNumber && (
            <>
              <Tooltip label="이전 페이지" placement="bottom">
                <Button
                  onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
                  variant="outline"
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </Button>
              </Tooltip>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <Button
              onClick={() => handlePageButtonClick(pageNumber)}
              key={pageNumber}
              colorScheme={
                pageNumber === pageInfo.currentPageNumber ? "green" : "gray"
              }
              variant="outline"
            >
              {pageNumber}
            </Button>
          ))}

          {pageInfo.nextPageNumber && (
            <>
              <Tooltip label="다음 페이지" placement="bottom">
                <Button
                  onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
                  variant="outline"
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </Button>
              </Tooltip>
            </>
          )}
          <Tooltip label="맨 끝 페이지" placement="bottom">
            <Button
              onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              variant="outline"
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </Button>
          </Tooltip>
        </Flex>
      </Center>
    </>
  );
}
