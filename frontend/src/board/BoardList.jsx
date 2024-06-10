import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);

  useEffect(() => {
    axios.get("/api/board/list").then((res) => {
      setBoardList(res.data);
    });
  }, []);

  return (
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
          <Tr key={board.id}>
            <Td>{board.id}</Td>
            <Td>{board.title}</Td>
            <Td>{board.userId}</Td>
            <Td>{board.content}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
