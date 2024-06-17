import React, { createContext, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";

export const SignupCodeContext = createContext(null);

export function SignupCodeProvider({ children }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCheckedCode, setIsCheckedCode] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const { successToast, errorToast } = CustomToast();

  function handleInputPhoneNumber(input) {
    setPhoneNumber("010" + input);
    setIsCheckedCode(false);
  }

  function handleInputCode(code) {
    setVerificationCode(code);
  }

  function handleSendCode() {
    setIsSendingCode(true);
    axios.get(`/api/users/codes?phoneNumber=${phoneNumber}`);
  }

  function handleCheckCode() {
    axios
      .get(
        `/api/users/confirmation?phoneNumber=${phoneNumber}&verificationCode=${verificationCode}`,
      )
      .then(() => {
        successToast("휴대폰 번호가 인증되었습니다");
        setIsCheckedCode(true);
      })
      .catch(() => errorToast("인증번호가 다릅니다"))
      .finally(() => setIsSendingCode(false));
  }

  return (
    <LoginContext.Provider
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
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default SignupCodeProvider;
