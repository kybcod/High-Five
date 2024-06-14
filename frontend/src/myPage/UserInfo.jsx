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
import { CustomToast } from "../component/CustomToast.jsx";
import { Link, useNavigate } from "react-router-dom";

export function UserInfo() {
  const account = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [oldNickName, setOldNickName] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/users/${account.id}`).then((res) => {
      const dbUser = res.data;
      setUser({ ...dbUser });
      setOldNickName(dbUser.nickName);
    });
  }, []);

  function handleUserUpdate() {
    axios.put(`/api/users/${account.id}`, user).then().catch();
  }

  function handleUserDelete() {
    axios
      .delete(`/api/users/${account.id}`)
      .then(() => {
        successToast("회원 탈퇴되었습니다");
        account.logout();
        navigate("/");
      })
      .catch(() => errorToast("회원 탈퇴 중 문제가 발생했습니다"));
  }

  if (user === null) {
    return <Spinner />;
  }

  function handleDuplicated() {
    axios
      .get(`/api/users/nickNames?nickName=${user.nickName}`)
      .then(() => errorToast("이미 존재하는 닉네임입니다"))
      .catch(() => successToast("사용 가능한 닉네임입니다"));
  }

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
            placeholder={"변경 시에만 입력해주세요"}
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
              <Button onClick={handleDuplicated}>중복확인</Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button onClick={handleUserUpdate}>수정</Button>
        <Link onClick={handleUserDelete}>회원 탈퇴</Link>
      </Box>
    </Box>
  );
}
