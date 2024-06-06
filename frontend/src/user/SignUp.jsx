import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
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

  console.log(email);

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
        <Input onChange={(e) => setPhoneNumber(e.target.value)} />
      </FormControl>
      <Button onClick={handleSignUp}>회원가입</Button>
    </Box>
  );
}
