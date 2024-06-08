import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  function handleSignUp() {
    axios.post("/api/users", { email, password, nickName, phoneNumber });
  }
  // TODO. 휴대폰 번호 11자리 (-)없이 숫자만 입력 가능하게끔 설정, 표시 메세지, 형식 다르면 메세지 전송버튼 활성화 X

  function handleSendCode() {
    axios.get("/api/users/code");
  }

  return (
    <Box>
      <Box>회원 가입</Box>
      <FormControl>
        <FormLabel>이메일</FormLabel>
        <Input onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>비밀번호</FormLabel>
        <Input onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>닉네임</FormLabel>
        <Input onChange={(e) => setNickName(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>휴대폰 번호</FormLabel>
        <InputGroup>
          <Input onChange={(e) => setPhoneNumber(e.target.value)} />
          <InputRightElement>
            <Button onClick={handleSendCode}>인증 요청</Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          휴대폰 번호는 (-)를 제외한 숫자만 입력해주세요 ex)01011112222
        </FormHelperText>
      </FormControl>
      <Button onClick={handleSignUp}>회원가입</Button>
    </Box>
  );
}
