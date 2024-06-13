import { Box, Button } from "@chakra-ui/react";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "./component/LoginProvider.jsx";
import { CustomToast } from "./component/CustomToast.jsx";

export function UserAuth() {
  const account = useContext(LoginContext);
  const { successToast, errorToast } = CustomToast();

  function handleClick() {
    axios
      .get(`/api/users/auth:${account.id}`)
      .then(() => successToast("본인임"))
      .catch(() => errorToast("본인 아님"));
  }

  return (
    <Box>
      <Box>권한 확인</Box>
      <Button onClick={handleClick}>GET 요청</Button>
    </Box>
  );
}
