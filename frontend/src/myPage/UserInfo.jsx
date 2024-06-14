import {Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement,} from "@chakra-ui/react";
import {LoginContext} from "../component/LoginProvider.jsx";
import {useContext, useEffect} from "react";
import axios from "axios";

export function UserInfo() {
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/users/${account.id}`).then().catch();
  }, []);

  function handleUserUpdate() {
    // axios
    //   .put(`/api/users/${account.id}`)
    //   .then()
    //   .catch();
  }

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>이메일 주소</FormLabel>
          <Input
            placeholer={"변경 불가"}
            onChange={}
          />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input onChange={} />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input onChange={} />
        </FormControl>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input
              placeholer={"닉네임 중복 확인 필수"}
              onChange={}
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
