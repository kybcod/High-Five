import {
  Box,
  Spinner,
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

export function UserList() {
  const [userList, setUserList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/users/list").then((res) => setUserList(res.data));
  }, []);

  if (userList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Email</Th>
            <Th>Name</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userList.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.email}</Td>
              <Td>{user.nickName}</Td>
              <Td>{user.signupDateAndTime}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
