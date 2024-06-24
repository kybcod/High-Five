import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";

export function SignupPhoneNumber() {
  const [user, setUser] = useState({});
  const [sarchParams] = useSearchParams();
  const codeInfo = useContext(SignupCodeContext);
  const navigate = useNavigate();
  const { successToast, errorToast } = CustomToast();

  useEffect(() => {
    const emailParam = sarchParams.get("email");
    const nickNameParam = sarchParams.get("nickName");
    setUser({ email: emailParam, nickName: nickNameParam, phoneNumber: "" });
  }, []);

  function handleOauthSignup() {
    axios
      .post("/api/users", { ...user, phoneNumber: codeInfo.phoneNumber })
      .then(() => {
        successToast("회원 가입 되었습니다.");
        navigate("/");
      })
      .catch(() => errorToast("회원 가입 중 문제가 발생했습니다"))
      .finally();
  }

  return (
    <Center>
      <Box>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={user.email} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>nickName</FormLabel>
          <Input
            value={user.nickName}
            onChange={(e) => setUser({ ...user, nickName: e.target.value })}
          />
        </FormControl>
        <UserPhoneNumber />
      </Box>
      <Button onClick={handleOauthSignup}>가입</Button>
    </Center>
  );
}
