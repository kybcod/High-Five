import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [isCheckedCode, setIsCheckedCode] = useState(false);
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();

  function handleSignUp() {
    setIsLoading(true);
    axios
      .post("/api/users", { email, password, nickName, phoneNumber })
      .then(() => {
        successToast("회원가입이 완료되었습니다");
        navigate("/login");
      })
      .catch(() => errorToast("회원가입 중 문제가 발생하였습니다"))
      .finally(() => setIsLoading(false));
  }
  // TODO. 휴대폰 번호 11자리 (-)없이 숫자만 입력 가능하게끔 설정, 표시 메세지, 형식 다르면 메세지 전송버튼 활성화 X

  function handleSendCode() {
    axios.get(`/api/users/codes?phoneNumber=${phoneNumber}`);
  }

  function handleCheckEmail() {
    axios
      .get(`/api/users/emails?email=${email}`)
      .then(() => errorToast("이미 존재하는 이메일입니다"))
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

  return (
    <Box>
      <Box>회원 가입</Box>
      <FormControl>
        <FormLabel>이메일</FormLabel>
        <InputGroup>
          <Input
            type={"email"}
            maxLength="30"
            onChange={(e) => {
              setEmail(e.target.value);
              setIsValidEmail(!e.target.validity.typeMismatch);
              setIsCheckedEmail(false);
            }}
          />
          <InputRightElement>
            <Button
              onClick={handleCheckEmail}
              isDisabled={!isValidEmail || email.trim().length === 0}
            >
              중복확인
            </Button>
          </InputRightElement>
        </InputGroup>
        {isValidEmail || (
          <FormHelperText>올바른 이메일 형식이 아닙니다</FormHelperText>
        )}
        {isCheckedEmail || (
          <FormHelperText>이메일 중복확인을 해주세요</FormHelperText>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>비밀번호</FormLabel>
        <Input type="password" onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>비밀번호 확인</FormLabel>
        <Input
          type="password"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        {isCheckedPassword || (
          <FormHelperText>비밀번호가 일치하지 않습니다</FormHelperText>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>닉네임</FormLabel>
        <InputGroup>
          <Input
            onChange={(e) => {
              setNickName(e.target.value);
              setIsCheckedNickName(false);
            }}
            maxLength="10"
          />
          <InputRightElement>
            <Button
              onClick={handleCheckNickName}
              isDisabled={nickName.trim().length === 0}
            >
              중복확인
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>닉네임은 10자까지 작성 가능합니다</FormHelperText>
      </FormControl>
      <FormControl>
        <InputGroup>
          <InputLeftAddon>010</InputLeftAddon>
          <Input
            type="tel"
            placeholder={"phone number"}
            onChange={(e) => {
              setPhoneNumber("010" + e.target.value);
            }}
          />
          <InputRightElement>
            <Button
              onClick={handleSendCode}
              isDisabled={phoneNumber.length !== 11}
            >
              인증 요청
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          휴대폰 번호는 (-)를 제외한 숫자만 입력해주세요 ex)11112222
        </FormHelperText>
      </FormControl>
      <Button
        onClick={handleSignUp}
        isLoading={isLoading}
        isDisabled={isDisabled}
      >
        회원가입
      </Button>
    </Box>
  );
}
