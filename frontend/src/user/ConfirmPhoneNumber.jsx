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
import { CheckIcon } from "@chakra-ui/icons";

export function ConfirmPhoneNumber({
  phoneNumber,
  setPhoneNumber,
  isCheckedCode,
  setIsCheckedCode,
  isSendingCode,
  setIsSendingCode,
  handleSendCode,
  setVerificationCode,
  handleCheckCode,
}) {
  return (
    <Box>
      <FormControl>
        <InputGroup size="md">
          <InputLeftAddon bg={"none"} border={"none"}>
            010
          </InputLeftAddon>
          <Input
            pr="4.5rem"
            variant="flushed"
            type="tel"
            placeholder={"phone number"}
            onChange={(e) => {
              setPhoneNumber("010" + e.target.value);
              setIsCheckedCode(false);
            }}
          />
          <InputRightElement width="4.5rem">
            {isSendingCode || (
              <Button
                Button
                h="1.75rem"
                size="sm"
                onClick={handleSendCode}
                isDisabled={phoneNumber.length !== 11}
              >
                인증 요청
              </Button>
            )}
            {isSendingCode && (
              <Button
                Button
                h="1.75rem"
                size="sm"
                onClick={handleSendCode}
                isDisabled={phoneNumber.length !== 11}
              >
                재전송
              </Button>
            )}
          </InputRightElement>
        </InputGroup>
        <FormHelperText>
          휴대폰 번호는 010과 (-)를 제외한 숫자만 입력해주세요 ex)11112222
        </FormHelperText>
      </FormControl>
      {setIsSendingCode && (
        <FormControl>
          <FormLabel>인증번호 입력</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              variant="flushed"
              type="number"
              placeholder={"인증번호를 입력하세요"}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              {isCheckedCode || (
                <Button h="1.75rem" size="sm" onClick={handleCheckCode}>
                  확인
                </Button>
              )}
              {isCheckedCode && <CheckIcon color="green.500" />}
            </InputRightElement>
          </InputGroup>
        </FormControl>
      )}
    </Box>
  );
}
