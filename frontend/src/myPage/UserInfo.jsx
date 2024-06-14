import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

export function UserInfo() {
  const account = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [oldNickName, setOldNickName] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  useEffect(() => {
    console.log(account.id);
    axios.get(`/api/users/${account.id}`).then((res) => {
      const dbUser = res.data;
      setUser({ ...dbUser });
      setOldNickName(dbUser.nickName);
    });
  }, []);

  function handleUserUpdate() {
    axios.put(`/api/users/${account.id}`, user).then().catch();
  }

  if (user === null) {
    return <Spinner />;
  }

  console.log(user);

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>이메일 주소</FormLabel>
          <Input placeholer={"변경 불가"} readOnly value={user.email} />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input onChange={(e) => setPasswordCheck(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input
              placeholer={"닉네임 중복 확인 필수"}
              value={user.nickName}
              onChange={(e) => setUser({ ...user, nickName: e.target.value })}
            />
            <InputRightElement>
              <Button>중복확인</Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button onClick={handleUserUpdate}>수정</Button>
        <a>회원 탈퇴</a>
      </Box>
    </Box>
  );
}
