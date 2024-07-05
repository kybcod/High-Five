import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  Heading,
  Image,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { Link, useNavigate } from "react-router-dom";
import { CustomToast } from "../component/CustomToast.jsx";
import { buttonStyle } from "../component/css/style.js";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const { errorToast } = CustomToast();

  useEffect(() => {}, []);

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
          <Box>
            <Heading>Function</Heading>
            <Center mt={1} fontSize={"lg"} fontWeight={"bold"}>
              <Text>로그인</Text>
            </Center>
          </Box>
        </Center>
        <Box mt={10}>
          <FormControl>
            <InputGroup width={"400px"}>
              <Input
                placeholder={"이메일을 입력하세요"}
                sx={{ "::placeholder": { fontSize: "sm" } }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box mt={3}>
          <FormControl>
            <InputGroup width={"400px"}>
              <Input
                placeholder={"비밀번호를 입력하세요"}
                sx={{ "::placeholder": { fontSize: "sm" } }}
                type={"password"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </FormControl>
        </Box>
        <Box mt={3}>
          <Center>
            <Flex gap={10} fontSize={"sm"} color={"gray.700"}>
              <Link to={"/signup"}>이메일 가입</Link>
              <Link to={"/user/email"}>이메일 찾기</Link>
              <Link to={"/user/password"}>비밀번호 찾기</Link>
            </Flex>
          </Center>
        </Box>
        <Box mt={8}>
          <Button {...buttonStyle} onClick={handleLogin}>
            로그인
          </Button>
        </Box>
        <Divider mt={7} border={"1px solid"} borderColor={"gray.200"} />
        {/* 카카오 로그인, 구글 로그인, 네이버 로그인 순서*/}
        <Center mt={5} fontSize={"sm"}>
          <Text>간편 로그인</Text>
        </Center>
        <Flex mt={5} justifyContent={"center"} gap={7}>
          <a href="http://3.39.193.68:8080/oauth2/authorization/kakao">
            <Image
              width={"50px"}
              src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Ft1vHi%2FbtsIiWtmqdW%2FMFrKl7D3oAVOmICc4zTVuk%2Fimg.webp"
            />
          </a>
          <a href="http://3.39.193.68:8080/oauth2/authorization/google">
            <Image
              width={"50px"}
              src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb22uox%2FbtsIhMyuE9r%2FO3yYJ4lf8iWgzslXfvE5X0%2Fimg.png"
            />
          </a>
          <a href="http://3.39.193.68:8080/oauth2/authorization/naver">
            <Image
              width={"50px"}
              src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FnrXzH%2FbtsIjibSXmY%2FhuvZ5Dc784XBP392KnCx8k%2Fimg.png"
            />
          </a>
        </Flex>
      </Box>
    </Center>
  );
}
