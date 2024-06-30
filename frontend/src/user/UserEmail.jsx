import { Box, Button, Center, Divider, Text } from "@chakra-ui/react";
import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import { useContext, useEffect, useState } from "react";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { buttonStyle, title } from "../component/css/style.js";
import { useNavigate } from "react-router-dom";

export function UserEmail() {
  const codeInfo = useContext(SignupCodeContext);
  const [email, setEmail] = useState("");
  const [hasEmail, setHasEmail] = useState(false);
  const { errorToast } = CustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    codeInfo.setPhoneNumber("");
    codeInfo.setIsCheckedCode(false);
    codeInfo.setVerificationCode("");
    setHasEmail(false);
  }, []);

  function handleFindEmail() {
    axios
      .get(`/api/users/emails/${codeInfo.phoneNumber}`)
      .then((res) => {
        setEmail(res.data);
        setHasEmail(true);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          errorToast("해당 번호로 가입된 회원이 없습니다");
        } else if (err.response.status === 400) {
          errorToast(
            "전화번호 자릿수가 올바르지 않습니다. 010을 제외한 8자를 입력해주세요",
          );
        } else {
          errorToast("회원 조회 중 문제가 발생했습니다. 다시 시도해주세요");
        }
      });
  }

  return (
    <Center>
      <Box>
        <Center mb={4} mt={7}>
          <Box>
            <Center>
              <Text {...title}>이메일 찾기</Text>
            </Center>
          </Box>
        </Center>
        <Divider borderColor={"teal"} mt={7} />
        <UserPhoneNumber />
        <Center mt={10}>
          <Button
            {...buttonStyle}
            onClick={handleFindEmail}
            isDisabled={!codeInfo.isCheckedCode}
          >
            이메일 찾기
          </Button>
        </Center>
        {/*{hasEmail && (*/}
        <Center mt={10} border={"1px"} borderColor={"gray.200"} pt={5} pb={5}>
          <Box>
            <Text fontSize={"sm"}>휴대전화 정보와 일치하는 이메일입니다</Text>
            <Center>
              <Text fontSize={"lg"}>{"Email : " + email}</Text>
            </Center>
          </Box>
        </Center>
        <Center>
          <Text
            as={"u"}
            color={"gray.600"}
            mt={5}
            onClick={() =>
              navigate(
                `/user/password?email=${email}&phoneNumber=${codeInfo.phoneNumber}`,
              )
            }
            cursor={"pointer"}
          >
            비밀번호 재설정하기
          </Text>
        </Center>
        {/*)}*/}
      </Box>
    </Center>
  );
}
