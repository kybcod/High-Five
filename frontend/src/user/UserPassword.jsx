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

export function UserPassword() {
  const [email, setEmail] = useState("");
  const codeInfo = useContext(SignupCodeContext);

  function handleFindPassword() {}

  return (
    <Center>
      <Box>
        <FormControl>
          <FormLabel>이메일 찾기</FormLabel>
          <Input onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <UserPhoneNumber />
        <Center>
          <Button
            onClick={handleFindPassword}
            // isDisabled={!codeInfo.isCheckedCode}
          >
            이메일 찾기
          </Button>
        </Center>
        {codeInfo.isCheckedCode && (
          <Center>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input variant="flushed" readOnly value={"password"} />
            </FormControl>
          </Center>
        )}
      </Box>
    </Center>
  );
}
