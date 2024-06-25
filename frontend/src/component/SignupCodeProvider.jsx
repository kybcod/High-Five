import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CustomToast } from "./CustomToast.jsx";

export const SignupCodeContext = createContext(undefined);

export function SignupCodeProvider({ children }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isCheckedCode, setIsCheckedCode] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(3);
  const time = useRef(180);
  const timerId = useRef(null);
  const { successToast, errorToast } = CustomToast();

  useEffect(() => {
    setPhoneNumber("");
    setIsCheckedCode(false);
    setVerificationCode("");
  }, []);

  useEffect(() => {
    if (time.current === -1) {
      clearInterval(timerId.current);
    }
  }, [sec]);

  let isWrongPhoneNumberLength = phoneNumber.length !== 8;
  let isDisabledCheckButton = false;

  if (verificationCode.trim().length !== 4) {
    isDisabledCheckButton = true;
  }

  if (time.current === -1) {
    isDisabledCheckButton = true;
  }

  function handleInputPhoneNumber(input) {
    const prefix = "010-";
    input = prefix + input.substring(prefix.length);
    setPhoneNumber(input);
    setIsCheckedCode(false);
  }

  function handleInputCode(code) {
    setVerificationCode(code);
  }

  function handleSendCode() {
    clearInterval(timerId.current);
    time.current = 180;
    timerId.current = setInterval(() => {
      setMin(parseInt(time.current / 60));
      setSec(time.current % 60);
      time.current -= 1;
    }, 1000);

    setIsSendingCode(true);
    axios.get(`/api/users/codes?phoneNumber=010${phoneNumber}`).catch((err) => {
      if (err.response.status === 400) {
        errorToast(
          "전화번호 자릿수가 올바르지 않습니다. 010을 제외한 8자를 입력해주세요",
        );
      } else {
        errorToast("인증번호 전송 중 오류가 발생했습니다. 다시 시도해주세요");
      }
    });
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
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("인증번호가 일치하지 않습니다");
        } else {
          errorToast(
            "인증 중 문제가 발생하였습니다. 처음부터 다시 시도해주세요",
          );
        }
      })
      .finally(() => setIsSendingCode(false));
  }

  return (
    <SignupCodeContext.Provider
      value={{
        sec: sec,
        min: min,
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
