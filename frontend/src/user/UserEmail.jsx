import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import { useContext, useState } from "react";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";

export function UserEmail() {
  const codeInfo = useContext(SignupCodeContext);
  const [email, setEmail] = useState("");
  const { errorToast } = CustomToast();
  function handleFindEmail() {
    axios
      .get(`/api/users/emails/${"010" + codeInfo.phoneNumber}`)
      .then((res) => setEmail(res.data))
      .catch((err) => {
        if (err.response.status === 404) {
          errorToast("해당 번호로 가입된 회원이 없습니다");
        } else {
          errorToast("회원 조회 중 문제가 발생했습니다. 다시 시도해주세요");
        }
      });
  }

  return (
    <Center>
      <Box>
        <UserPhoneNumber />
        <Center>
          <Button
            onClick={handleFindEmail}
            // isDisabled={!codeInfo.isCheckedCode}
          >
            이메일 찾기
          </Button>
        </Center>
        {codeInfo.isCheckedCode && (
          <Center>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input variant="flushed" readOnly value={email} />
            </FormControl>
          </Center>
        )}
        {codeInfo.isCheckedCode && (
          <Center>
            <Button>비밀번호 찾기</Button>
          </Center>
        )}
      </Box>
    </Center>
  );
}
