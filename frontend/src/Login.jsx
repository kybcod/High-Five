import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "./component/LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "./component/CustomToast.jsx";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const { errorToast } = CustomToast();

  function handleLogin() {
    axios
      .post("api/users/login", { email, password })
      .then((res) => {
        account.login(res.data.token);
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          errorToast("아이디나 비밀번호가 일치하지 않습니다");
        } else {
          errorToast("로그인 중 문제가 발생하였습니다");
        }
      });
  }

  return (
    <Box>
      <Box>로그인</Box>
      <FormControl>
        <FormLabel>이메일</FormLabel>
        <Input onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>비밀번호</FormLabel>
        <Input
          type={"password"}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button onClick={handleLogin}>로그인</Button>
    </Box>
  );
}
