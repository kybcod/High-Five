import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { Link, useNavigate } from "react-router-dom";
import { CustomToast } from "../component/CustomToast.jsx";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        if (err.response.status === 404) {
          errorToast("아이디나 비밀번호가 일치하지 않습니다");
        } else if (err.response.status === 401) {
          errorToast("신고 누적으로 정지된 유저입니다");
        } else {
          errorToast("로그인 중 문제가 발생하였습니다");
        }
      });
  }

  return (
    <Center>
      <Box>
        <Center>
          <Heading>Live Auction</Heading>
        </Center>
        <Box mt={10}>
          <FormControl>
            <InputGroup width={"400px"}>
              <InputLeftAddon color="gray.300">
                <FontAwesomeIcon icon={faUser} />
              </InputLeftAddon>
              <Input
                placeholder={"Username"}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box mt={3}>
          <FormControl>
            <InputGroup width={"400px"}>
              <InputLeftAddon color="gray.300">
                <FontAwesomeIcon icon={faKey} />
              </InputLeftAddon>
              <Input
                placeholder={"••••"}
                type={"password"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box mt={3}>
          <Center>
            <Flex gap={10} fontSize={"md"}>
              <Link to={"/signup"}>이메일 가입</Link>
              <Link to={"/user/email"}>이메일 찾기</Link>
              <Link to={"/user/password"}>비밀번호 찾기</Link>
            </Flex>
          </Center>
        </Box>
        <Box mt={5}>
          <Button
            height="38px"
            width="400px"
            onClick={handleLogin}
            colorScheme={"green"}
          >
            Login
          </Button>
          <a href="http://localhost:8080/oauth2/authorization/kakao">
            카카오 로그인
          </a>
          <a href="http://localhost:8080/oauth2/authorization/naver">
            네이버 로그인
          </a>
        </Box>
      </Box>
    </Center>
  );
}
