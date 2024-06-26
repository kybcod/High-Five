import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { useNavigate } from "react-router-dom";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";
import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import SignupButton from "./SignupButton.jsx";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const { successToast, errorToast } = CustomToast();
  const codeInfo = useContext(SignupCodeContext);
  const navigate = useNavigate();
  const [isAllChecked, setIsAllChecked] = useState(false);

  function handleSignUp() {
    setIsLoading(true);
    const phoneNumber = codeInfo.phoneNumber;
    axios
      .post("/api/users", {
        email,
        password,
        nickName,
        phoneNumber: phoneNumber,
      })
      .then(() => {
        successToast("회원가입이 완료되었습니다");
        navigate("/login");
      })
      .catch(() => errorToast("회원가입 중 문제가 발생하였습니다"))
      .finally(() => setIsLoading(false));
  }
  // TODO. 휴대폰 번호 11자리 (-)없이 숫자만 입력 가능하게끔 설정, 표시 메세지, 형식 다르면 메세지 전송버튼 활성화 X

  function handleCheckEmail() {
    axios
      .get(`/api/users/emails?email=${email}`)
      .then(() =>
        errorToast("이미 존재하는 이메일이거나 이메일 형식이 아닙니다"),
      )
      .catch((err) => {
        setIsCheckedEmail(true);
        if (err.response.status === 404) {
          successToast("사용가능한 이메일입니다");
        } else {
          errorToast("이메일 조회 중 에러가 발생했습니다");
        }
      });
  }

  function handleCheckNickName() {
    axios
      .get(`/api/users/nickNames?nickName=${nickName}`)
      .then(() => errorToast("이미 존재하는 닉네임입니다"))
      .catch((err) => {
        setIsCheckedNickName(true);
        if (err.response.status === 404) {
          successToast("사용가능한 닉네임입니다");
        } else {
          errorToast("닉네임 조회 중 에러가 발생했습니다");
        }
      });
  }

  let isDisabled = false;
  const isCheckedPassword = password === passwordCheck;
  const passwordPattern =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  let isValidPassword = false;
  if (passwordPattern.test(password)) {
    isValidPassword = true;
  }

  if (
    !(
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      nickName.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  if (!isCheckedPassword) {
    isDisabled = true;
  }

  if (!isValidEmail) {
    isDisabled = true;
  }

  if (!isCheckedEmail) {
    isDisabled = true;
  }

  if (!isCheckedNickName) {
    isDisabled = true;
  }

  if (!isValidPassword) {
    isDisabled = true;
  }

  if (!isAllChecked) {
    isDisabled = true;
  }

  return (
    <Center>
      <Box color={"gray.500"} mt={70} width={"500px"}>
        <Text fontSize={"3xl"} fontWeight={"bold"} color={"black"}>
          본인 정보를 입력해주세요
        </Text>
        <FormControl mt={7}>
          <FormLabel fontSize="sm" fontWeight={"bold"}>
            이메일 주소
          </FormLabel>
          <InputGroup size="md">
            <Input
              fontSize="2xl"
              color={"black"}
              pr="4.5rem"
              sx={{ "::placeholder": { fontSize: "xl" } }}
              placeholder={"이메일 중복 확인 필수"}
              isInvalid={isCheckedEmail ? false : true}
              errorBorderColor={"orange.200"}
              variant="flushed"
              type={"email"}
              maxLength="30"
              onChange={(e) => {
                setEmail(e.target.value);
                setIsValidEmail(!e.target.validity.typeMismatch);
                setIsCheckedEmail(false);
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleCheckEmail}
                isDisabled={!isValidEmail || email.trim().length === 0}
                colorScheme="orange"
                variant="ghost"
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
          {isValidEmail || (
            <FormHelperText>올바른 이메일 형식이 아닙니다</FormHelperText>
          )}
        </FormControl>
        <FormControl mt={7}>
          <FormLabel fontSize="sm" fontWeight={"bold"}>
            비밀번호
          </FormLabel>
          <Input
            fontSize="2xl"
            color={"black"}
            pr="4.5rem"
            variant="flushed"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              isValidPassword = false;
            }}
            isInvalid={isValidPassword ? false : true}
            errorBorderColor={"orange.200"}
          />
          {isValidPassword || (
            <FormHelperText>
              비밀번호는 8자 이상으로, 영문 대소문자와 숫자, 특수기호를
              포함하여야 합니다
            </FormHelperText>
          )}
        </FormControl>
        <FormControl mt={7}>
          <FormLabel fontSize="sm" fontWeight={"bold"}>
            비밀번호 확인
          </FormLabel>
          <Input
            fontSize="2xl"
            color={"black"}
            pr="4.5rem"
            isInvalid={isCheckedPassword ? false : true}
            errorBorderColor={"orange.200"}
            variant="flushed"
            type="password"
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {isCheckedPassword || (
            <FormHelperText>비밀번호가 일치하지 않습니다</FormHelperText>
          )}
        </FormControl>
        <FormControl mt={7}>
          <FormLabel fontSize="sm" fontWeight={"bold"}>
            닉네임
          </FormLabel>
          <InputGroup size="md">
            <Input
              pb={3}
              focusBorderColor="gray.200"
              fontSize="2xl"
              color={"black"}
              pr="4.5rem"
              sx={{ "::placeholder": { fontSize: "xl" } }}
              isInvalid={isCheckedNickName ? false : true}
              errorBorderColor={"orange.200"}
              variant="flushed"
              onChange={(e) => {
                setNickName(e.target.value);
                setIsCheckedNickName(false);
              }}
              maxLength="10"
              placeholder={"닉네임 중복 확인 필수"}
            />
            <InputRightElement width="4.5rem">
              <Button
                colorScheme="orange"
                variant="ghost"
                h="1.75rem"
                size="sm"
                onClick={handleCheckNickName}
                isDisabled={nickName.trim().length === 0}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormHelperText>닉네임은 10자까지 작성 가능합니다</FormHelperText>
        </FormControl>
        <UserPhoneNumber />
        <SignupButton
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
        />
        <Center mt={10}>
          <Button
            height="60px"
            width="550px"
            colorScheme={"green"}
            borderRadius="5px"
            onClick={handleSignUp}
            isLoading={isLoading}
            isDisabled={isDisabled}
          >
            SignUp
          </Button>
        </Center>
      </Box>
    </Center>
  );
}
