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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { useNavigate } from "react-router-dom";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";
import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import InfoAgreeCheck from "./InfoAgreeCheck.jsx";
import {
  formLabel,
  helperText,
  InputGroupButton,
  InputGroupStyle,
  InputStyle,
  title,
} from "../component/css/style.js";

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

  useEffect(() => {
    codeInfo.setPhoneNumber("");
    codeInfo.setIsCheckedCode(false);
    codeInfo.setVerificationCode("");
  }, []);

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

  function handleCheckEmail() {
    axios
      .get(`/api/users/emails?email=${email}`)
      .then(() => {
        successToast("사용가능한 이메일입니다");
      })
      .catch((err) => {
        setIsCheckedEmail(true);
        if (err.response.status === 400) {
          errorToast("유효한 이메일 형식이 아닙니다");
        } else if (err.response.status === 409) {
          errorToast("이미 존재하는 이메일입니다");
        } else {
          errorToast("이메일 조회 중 에러가 발생했습니다");
        }
      });
  }

  function handleCheckNickName() {
    axios
      .get(`/api/users/nickNames?nickName=${nickName}`)
      .then(() => successToast("사용 가능한 닉네임입니다"))
      .catch((err) => {
        setIsCheckedNickName(true);
        if (err.response.status === 400) {
          errorToast("닉네임은 10자까지 입력할 수 있습니다");
        } else if (err.response.status === 409) {
          errorToast("이미 존재하는 닉네임입니다");
        } else {
          errorToast("이메일 조회 중 에러가 발생했습니다");
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
        <Text {...title}>본인 정보를 입력해주세요</Text>
        <FormControl mt={7}>
          <FormLabel {...formLabel}>이메일 주소</FormLabel>
          <InputGroup {...InputGroupStyle}>
            <Input
              {...InputStyle}
              placeholder={"이메일 중복 확인 필수"}
              isInvalid={isCheckedEmail ? false : true}
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
                {...InputGroupButton}
                onClick={handleCheckEmail}
                isDisabled={!isValidEmail || email.trim().length === 0}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
          {isValidEmail || (
            <FormHelperText {...helperText}>
              올바른 이메일 형식이 아닙니다
            </FormHelperText>
          )}
        </FormControl>
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
            <FormHelperText {...helperText}>
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
            <FormHelperText {...helperText}>
              비밀번호가 일치하지 않습니다
            </FormHelperText>
          )}
        </FormControl>
        <FormControl mt={7}>
          <FormLabel {...formLabel}>닉네임</FormLabel>
          <InputGroup {...InputGroupStyle}>
            <Input
              {...InputStyle}
              isInvalid={isCheckedNickName ? false : true}
              onChange={(e) => {
                setNickName(e.target.value);
                setIsCheckedNickName(false);
              }}
              maxLength="10"
              placeholder={"닉네임 중복 확인 필수"}
            />
            <InputRightElement width="4.5rem">
              <Button
                {...InputGroupButton}
                onClick={handleCheckNickName}
                isDisabled={nickName.trim().length === 0}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormHelperText {...helperText}>
            닉네임은 10자까지 작성 가능합니다
          </FormHelperText>
        </FormControl>
        <UserPhoneNumber />
        <InfoAgreeCheck
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
        />
        <Center mt={10}>
          <Button
            height="60px"
            width="550px"
            colorScheme={"teal"}
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
