import { Box, Button } from "@chakra-ui/react";
import axios from "axios";

export function UserAuth() {
  function handleClick() {
    axios.get("/api/users/auth");
  }

  return (
    <Box>
      <Box>권한 확인</Box>
      <Button onClick={handleClick}>GET 요청</Button>
    </Box>
  );
}
