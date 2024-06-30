import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import { useContext, useEffect, useState } from "react";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import {
  buttonStyle,
  formLabel,
  InputStyle,
  title,
} from "../component/css/style.js";
import { useSearchParams } from "react-router-dom";

export function UserPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const codeInfo = useContext(SignupCodeContext);
  const { successToast, errorToast } = CustomToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const phoneNumber = searchParams.get("phoneNumber");
    if (emailParam) {
      setEmail(emailParam);
    }
    if (phoneNumber) {
      codeInfo.setPhoneNumber(phoneNumber);
    } else {
      codeInfo.setPhoneNumber("");
    }
    codeInfo.setIsCheckedCode(false);
    codeInfo.setVerificationCode("");
  }, []);

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
      <Box width={"500px"}>
        <Center>
          <Box>
            <Center>
              <Text {...title}>비밀번호 찾기</Text>
            </Center>
            <Text>핸드폰 인증 후 비밀번호 재설정이 가능합니다</Text>
          </Box>
        </Center>
        <Divider borderColor={"teal"} mt={7} />
        <FormControl mt={10}>
          <FormLabel {...formLabel}>이메일</FormLabel>
          <Input
            {...InputStyle}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>
        <UserPhoneNumber />
        {codeInfo.isCheckedCode && (
          <Center mt={10}>
            <Box border={"1px"} borderColor={"gray.200"} p={5}>
              <Center>
                <Heading fontSize={"lg"}>새 비밀번호를 입력해주세요</Heading>
              </Center>
              <FormControl mt={7}>
                <FormLabel {...formLabel}>비밀번호</FormLabel>
                <Input
                  {...InputStyle}
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    isValidPassword = false;
                  }}
                  isInvalid={isValidPassword ? false : true}
                />
                {isValidPassword || (
                  <FormHelperText>
                    비밀번호는 8자 이상으로, 영문 대소문자와 숫자, 특수기호를
                    포함하여야 합니다
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl mt={7}>
                <FormLabel {...formLabel}>비밀번호 확인</FormLabel>
                <Input
                  {...InputStyle}
                  isInvalid={isCheckedPassword ? false : true}
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
          <Center mt={10}>
            <Button
              onClick={handleUpdatePassword}
              isDisabled={isDisabled}
              {...buttonStyle}
            >
              비밀번호 재설정
            </Button>
          </Center>
        )}
      </Box>
    </Center>
  );
}
