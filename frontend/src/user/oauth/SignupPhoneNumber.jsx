import { UserPhoneNumber } from "../UserPhoneNumber.jsx";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SignupCodeContext } from "../../component/SignupCodeProvider.jsx";
import axios from "axios";
import { CustomToast } from "../../component/CustomToast.jsx";

export function SignupPhoneNumber() {
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const codeInfo = useContext(SignupCodeContext);
  const navigate = useNavigate();
  const { successToast, errorToast } = CustomToast();
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const nickNameParam = searchParams.get("nickName");
    setUser({ email: emailParam, nickName: nickNameParam, phoneNumber: "" });
  }, []);

  if (user === null) {
    return <Spinner />;
  }

  function handleOauthSignup() {
    setIsLoading(true);
    axios
      .post("/api/users", {
        ...user,
        phoneNumber: "010" + codeInfo.phoneNumber,
        password: "oauth",
      })
      .then(() => {
        successToast("회원 가입 되었습니다.");
        navigate("/");
      })
      .catch(() => errorToast("회원 가입 중 문제가 발생했습니다"))
      .finally(() => setIsLoading(false));
  }

  function handleDuplicated() {
    axios
      .get(`/api/users/nickNames?nickName=${user.nickName}`)
      .then(() => {
        errorToast("이미 존재하는 닉네임입니다");
      })
      .catch(() => {
        successToast("사용 가능한 닉네임입니다");
        setIsCheckedNickName(true);
      });
  }

  let disabledNickNameCheckButton = true;
  let disabled = false;

  if (user.nickName.length === 0) {
    disabledNickNameCheckButton = false;
  }

  if (!isCheckedNickName) {
    disabled = true;
  }

  if (!disabledNickNameCheckButton) {
    disabled = true;
  }

  if (!codeInfo.isCheckedCode) {
    disabled = true;
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
          <InputGroup>
            <Input
              value={user.nickName}
              onChange={(e) => setUser({ ...user, nickName: e.target.value })}
            />
            <InputRightElement>
              <Button
                onClick={handleDuplicated}
                isDisabled={!disabledNickNameCheckButton}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <UserPhoneNumber />
      </Box>
      <Button
        isDisabled={disabled}
        onClick={handleOauthSignup}
        isLoading={isLoading}
      >
        가입
      </Button>
    </Center>
  );
}
