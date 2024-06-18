import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fullHeart,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
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

  return (
    <Box>
      <Box>
        <Heading>자유게시판 목록</Heading>
      </Box>
      <Box>
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
            {boardList.map((board) => (
              <Tr onClick={() => navigate(`/board/${board.id}`)} key={board.id}>
                <Td>{board.id}</Td>
                <Td>
                  {board.title}
                  {board.numberOfImages > 0 && (
                    <Badge>
                      <Flex>
                        <Box>
                          <FontAwesomeIcon icon={faImage} />
                        </Box>
                        <Box>{board.numberOfImages}</Box>
                      </Flex>
                    </Badge>
                  )}
                  {board.numberOfLikes > 0 && (
                    <Badge>
                      <Flex>
                        <Box>
                          <FontAwesomeIcon icon={fullHeart} />
                        </Box>
                        <Box>{board.numberOfLikes}</Box>
                      </Flex>
                    </Badge>
                  )}
                </Td>
                <Td>{board.userId}</Td>
                <Td>{board.inserted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Center>
        {pageNumbers.map((pageNumber) => (
          <ButtonGroup
            key={pageNumber}
            onClick={() => handlePageButtonClick(pageNumber)}
          >
            <Button>{pageNumber}</Button>
          </ButtonGroup>
        ))}
      </Center>
    </Box>
  );
}
