import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useContext } from "react";
import { SignupCodeContext } from "../component/SignupCodeProvider.jsx";

export function UserPhoneNumber() {
  const codeInfo = useContext(SignupCodeContext);

  return (
    <Box>
      <FormControl>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            variant="flushed"
            maxLength={13}
            value={codeInfo.phoneNumber}
            placeholder={"phone number"}
            onChange={(e) => {
              codeInfo.handleInputPhoneNumber(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem">
            {codeInfo.isSendingCode && (
              <Text>
                {codeInfo.min +
                  ":" +
                  (codeInfo.sec < 10 ? "0" + codeInfo.sec : codeInfo.sec)}
              </Text>
            )}
            {codeInfo.isSendingCode || (
              <Button
                h="1.75rem"
                size="sm"
                onClick={codeInfo.handleSendCode}
                isDisabled={codeInfo.isWrongPhoneNumberLength}
              >
                인증 요청
              </Button>
            )}
            {codeInfo.isSendingCode && (
              <Button
                h="1.75rem"
                size="sm"
                onClick={codeInfo.handleSendCode}
                isDisabled={codeInfo.isWrongPhoneNumberLength}
              >
                재전송
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>인증번호 입력</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            variant="flushed"
            type="number"
            placeholder={"인증번호를 입력하세요"}
            onChange={(e) => codeInfo.handleInputCode(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            {codeInfo.isCheckedCode || (
              <Button
                h="1.75rem"
                size="sm"
                onClick={codeInfo.handleCheckCode}
                isDisabled={codeInfo.isDisabledCheckButton}
              >
                확인
              </Button>
            )}
            {codeInfo.isCheckedCode && <CheckIcon color="green.500" />}
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </Box>
  );
}
