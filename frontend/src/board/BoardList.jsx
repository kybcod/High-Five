import {
  Badge,
  Box,
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
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart as fullHeart,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/board/list").then((res) => {
      setBoardList(res.data);
    });
  }, []);

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
    </Box>
  );
}
