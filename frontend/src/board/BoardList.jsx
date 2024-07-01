import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Spacer,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faComment,
  faHeart as fullHeart,
  faImage,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [clickedId, setClickedId] = useState(null);
  const [totalBoardNumber, setTotalBoardNumber] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const account = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { successToast, errorToast } = CustomToast();

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }

    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      console.log(res.data);
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
      setTotalBoardNumber(res.data.totalBoardNumber);
      setSearchKeyword("");
    });
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/board/list/?${searchParams}`);
  }

  function handleSearchButtonClick() {
    navigate(`/board/list/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handleClickAdminDelete(e, id) {
    console.log(id);
    e.stopPropagation();
    axios
      .delete(`/api/board/${id}`)
      .then(() => {
        successToast("게시물이 삭제되었습니다");
        setBoardList(boardList.filter((board) => board.id !== id));
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("게시물 삭제에 실패했습니다. 다시 삭제해주세요");
        }
      })
      .finally(() => onClose());
  }

  return (
    <Box>
      <Flex>
        <Heading>자유게시판 목록</Heading>
        <Spacer />
      </Flex>
      <Box>
        <Table mt={"30px"}>
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>제목</Th>
              <Th>작성자</Th>
              <Th>댓글수</Th>
              <Th>조회수</Th>
              <Th>작성시간</Th>
              {account.isAdmin(account.id) && <Th>admin</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {boardList.length === 0 && (
              <Tr>
                <Td colSpan={5}>
                  <Center>검색 결과가 없습니다.</Center>
                </Td>
              </Tr>
            )}
            {boardList.length > 0 &&
              boardList.map((board, index) => (
                <Tr
                  onClick={() => navigate(`/board/${board.id}`)}
                  key={board.id}
                  cursor={"pointer"}
                  _hover={{ background: "gray.200" }}
                >
                  <Td>
                    {totalBoardNumber - pageInfo.currentPageNumber * 10 - index}
                  </Td>
                  <Td>
                    {board.title}
                    {board.numberOfImages > 0 && (
                      <Badge ml={"10px"} variant={"outline"} w={"35px"}>
                        <Flex justifyContent={"center"}>
                          <Box>
                            <FontAwesomeIcon icon={faImage} />
                          </Box>
                          <Box ml={1}>{board.numberOfImages}</Box>
                        </Flex>
                      </Badge>
                    )}
                    {board.numberOfLikes > 0 && (
                      <Badge
                        ml={"10px"}
                        colorScheme={"red"}
                        variant={"outline"}
                        w={"35px"}
                      >
                        <Flex justifyContent={"center"}>
                          <Box>
                            <FontAwesomeIcon icon={fullHeart} />
                          </Box>
                          <Box ml={1}>{board.numberOfLikes}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.nickName}</Td>
                  <Td>
                    <FontAwesomeIcon
                      icon={faComment}
                      size={"sm"}
                      style={{ marginRight: "5px" }}
                    />
                    {board.numberOfComments}
                  </Td>
                  <Td>{board.viewCount}</Td>
                  <Td>{board.inserted}</Td>
                  {account.isAdmin(account.id) && (
                    <Td>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setClickedId(board.id);
                          onOpen();
                        }}
                        variant={"outline"}
                        color={"red"}
                        sx={{
                          borderWidth: "2px",
                          borderColor: "red",
                        }}
                        size={"sm"}
                      >
                        삭제
                      </Button>
                    </Td>
                  )}
                  <Td hidden>{board.content}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>관리자 권한으로 게시글 삭제</ModalHeader>
            <ModalBody>
              <Text>게시글을 삭제하시겠습니까?</Text>
            </ModalBody>
            <ModalFooter>
              <Flex>
                <Button onClick={onClose}>취소</Button>
                <Button
                  onClick={(e) => {
                    handleClickAdminDelete(e, clickedId);
                  }}
                  colorScheme={"red"}
                  ml={"10px"}
                >
                  삭제
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant={"outline"}
          colorScheme={"teal"}
          sx={{ borderWidth: 2 }}
          onClick={() => navigate(`/board`)}
          mt={"20px"}
        >
          글쓰기
        </Button>
      </Box>
      <Center mt={"10px"}>
        <Flex gap={2}>
          <Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value={"all"}>전체</option>
            <option value={"text"}>내용+제목</option>
            <option value={"nickName"}>작성자</option>
          </Select>
          <Input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <Button
            onClick={handleSearchButtonClick}
            background={"none"}
            _hover={{ background: "none" }}
            sx={{
              _focus: {
                boxShadow: "none",
              },
              _active: {
                bg: "transparent",
              },
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} color={"teal"} />
          </Button>
        </Flex>
      </Center>
      <Center mt={"15px"}>
        <Flex gap={1}>
          {pageInfo.prevPageNumber && (
            <Button
              onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              variant={"outline"}
              colorScheme={"teal"}
              borderWidth={2}
            >
              <FontAwesomeIcon icon={faAnglesLeft} />
            </Button>
          )}
          {pageInfo.leftPageNumber && (
            <Button
              onClick={() => handlePageButtonClick(pageInfo.leftPageNumber)}
              variant={"outline"}
              colorScheme={"teal"}
              borderWidth={2}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </Button>
          )}
          {pageNumbers.map((pageNumber) => (
            <ButtonGroup
              key={pageNumber}
              onClick={() => handlePageButtonClick(pageNumber)}
            >
              <Button variant={"outline"} colorScheme={"teal"} borderWidth={2}>
                {pageNumber}
              </Button>
            </ButtonGroup>
          ))}
          {pageInfo.rightPageNumber && (
            <Button
              onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              variant={"outline"}
              colorScheme={"teal"}
              borderWidth={2}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </Button>
          )}
          {pageInfo.nextPageNumber && (
            <Button
              onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              variant={"outline"}
              colorScheme={"teal"}
              borderWidth={2}
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </Button>
          )}
        </Flex>
      </Center>
    </Box>
  );
}
