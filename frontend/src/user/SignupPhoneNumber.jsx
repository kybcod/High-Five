import { UserPhoneNumber } from "./UserPhoneNumber.jsx";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function SignupPhoneNumber() {
  const [user, setUser] = useState({});
  const [sarchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = sarchParams.get("email");
    const nickNameParam = sarchParams.get("nickName");
    setUser({ email: emailParam, nickName: nickNameParam });
  }, []);

  return (
    <Center>
      <Box>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={user.email} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>nickName</FormLabel>
          <Input value={user.nickName} />
        </FormControl>
        <UserPhoneNumber />
      </Box>
      <Button>가입</Button>
    </Center>
  );
}
