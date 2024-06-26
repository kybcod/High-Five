import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import { useContext, useState } from "react";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";

export function UserPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const codeInfo = useContext(SignupCodeContext);
  const { successToast, errorToast } = CustomToast();

  function handleUpdatePassword() {
    axios
      .put("/api/user/passwords", { email, password })
      .then(() => successToast("비밀번호가 변경되었습니다"))
      .catch((err) => {
        if (err.response.status === 404) {
          errorToast("입력한 정보에 맞는 회원 정보가 없습니다");
        } else {
          errorToast("비밀번호 변경 중 문제가 발생했습니다. 다시 시도해주세요");
        }
      });
  }

  const isCheckedPassword = password === passwordCheck;

  const passwordPattern =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  let isValidPassword = false;
  if (passwordPattern.test(password)) {
    isValidPassword = true;
  }

  let isDisabled = false;

  if (!(email.trim().length > 0 && password.trim().length > 0)) {
    isDisabled = true;
  }

  if (!codeInfo.isCheckedCode) {
    isDisabled = true;
  }

  if (!isCheckedPassword) {
    isDisabled = true;
  }

  return (
    <Center>
      <Box>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <UserPhoneNumber />
        {codeInfo.isCheckedCode && (
          <Center>
            <Box>
              <FormControl>
                <FormLabel>비밀번호</FormLabel>
                <Input
                  pr="4.5rem"
                  variant="flushed"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    isValidPassword = false;
                  }}
                  isInvalid={isValidPassword ? false : true}
                  errorBorderColor={"red.300"}
                />
                {isValidPassword || (
                  <FormHelperText>
                    비밀번호는 8자 이상으로, 영문 대소문자와 숫자, 특수기호를
                    포함하여야 합니다
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl>
                <FormLabel>비밀번호 확인</FormLabel>
                <Input
                  pr="4.5rem"
                  isInvalid={isCheckedPassword ? false : true}
                  errorBorderColor={"red.300"}
                  variant="flushed"
                  type="password"
                  onChange={(e) => setPasswordCheck(e.target.value)}
                />
                {isCheckedPassword || (
                  <FormHelperText>비밀번호가 일치하지 않습니다</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Center>
        )}
        {codeInfo.isCheckedCode && (
          <Center>
            <Button onClick={handleUpdatePassword} isDisabled={isDisabled}>
              비밀번호 재설정
            </Button>
          </Center>
        )}
      </Box>
    </Center>
  );
}
