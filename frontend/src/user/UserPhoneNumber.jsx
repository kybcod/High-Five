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
import {
  formLabel,
  InputGroupButton,
  InputGroupStyle,
  InputStyle,
} from "../component/css/style.js";

export function UserPhoneNumber() {
  const codeInfo = useContext(SignupCodeContext);

  return (
    <Box>
      <FormControl mt={7}>
        <FormLabel {...formLabel}>전화번호</FormLabel>
        <InputGroup {...InputGroupStyle}>
          <Input
            {...InputStyle}
            maxLength={13}
            value={codeInfo.phoneNumber}
            onChange={(e) => {
              codeInfo.handleInputPhoneNumber(e.target.value);
            }}
          />
          <InputRightElement width={codeInfo.isSendingCode ? "6rem" : "4.5rem"}>
            {codeInfo.isSendingCode && (
              <Text mr={2} color={"gray.800"}>
                {codeInfo.min +
                  ":" +
                  (codeInfo.sec < 10 ? "0" + codeInfo.sec : codeInfo.sec)}
              </Text>
            )}
            {codeInfo.isSendingCode || (
              <Button
                {...InputGroupButton}
                onClick={codeInfo.handleSendCode}
                isDisabled={codeInfo.isWrongPhoneNumberLength}
              >
                인증요청
              </Button>
            )}
            {codeInfo.isSendingCode && (
              <Button
                {...InputGroupButton}
                onClick={codeInfo.handleSendCode}
                isDisabled={codeInfo.isWrongPhoneNumberLength}
              >
                재전송
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl mt={7}>
        <FormLabel {...formLabel}>인증번호 입력</FormLabel>
        <InputGroup {...InputGroupStyle}>
          <Input
            maxLength={4}
            {...InputStyle}
            onChange={(e) => codeInfo.handleInputCode(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            {codeInfo.isCheckedCode || (
              <Button
                width="4.2rem"
                h="1.75rem"
                size="md"
                colorScheme="teal"
                variant="outline"
                fontSize="sm"
                p={1}
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
