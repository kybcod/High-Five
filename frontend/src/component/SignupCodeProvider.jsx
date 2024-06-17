import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { CustomToast } from "./CustomToast.jsx";

export const SignupCodeContext = createContext(undefined);

export function SignupCodeProvider({ children }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCheckedCode, setIsCheckedCode] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { successToast, errorToast } = CustomToast();

  useEffect(() => {
    setPhoneNumber("");
    setIsCheckedCode(false);
    setVerificationCode("");
  }, []);

  let isWrongPhoneNumberLength = phoneNumber.length !== 8;
  let isDisabledCheckButton = verificationCode.trim().length !== 4;

  function handleInputPhoneNumber(input) {
    input.replace(/[-\s]/g, "");
    console.log(input);
    setPhoneNumber(input);
    setIsCheckedCode(false);
  }

  function handleInputCode(code) {
    setVerificationCode(code);
  }

  function handleSendCode() {
    setIsSendingCode(true);
    axios.get(`/api/users/codes?phoneNumber=010${phoneNumber}`);
  }

  function handleCheckCode() {
    axios
      .get(
        `/api/users/confirmation?phoneNumber=010${phoneNumber}&verificationCode=${verificationCode}`,
      )
      .then(() => {
        successToast("휴대폰 번호가 인증되었습니다");
        setIsCheckedCode(true);
      })
      .catch(() => errorToast("인증번호가 다릅니다"))
      .finally(() => setIsSendingCode(false));
  }

  return (
    <SignupCodeContext.Provider
      value={{
        phoneNumber: phoneNumber,
        setPhoneNumber: setPhoneNumber,
        isCheckedCode: isCheckedCode,
        setIsCheckedCode: setIsCheckedCode,
        isSendingCode: isSendingCode,
        setIsSendingCode: setIsSendingCode,
        handleSendCode: handleSendCode,
        setVerificationCode: setVerificationCode,
        handleCheckCode: handleCheckCode,
        handleInputPhoneNumber: handleInputPhoneNumber,
        handleInputCode: handleInputCode,
        isWrongPhoneNumberLength: isWrongPhoneNumberLength,
        isDisabledCheckButton: isDisabledCheckButton,
      }}
    >
      {children}
    </SignupCodeContext.Provider>
  );
}

export default SignupCodeProvider;
