import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";

export function UserEdit() {
  const account = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [oldNickName, setOldNickName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { successToast, errorToast } = CustomToast();
  const { onClose, isOpen, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/users/${account.id}`).then((res) => {
      const dbUser = res.data;
      setUser({ ...dbUser });
      setOldNickName(dbUser.nickName);
    });
  }, []);

  function handleUserUpdate() {
    setIsLoading(true);
    axios
      .put(`/api/users/${account.id}`, { ...user, oldPassword })
      .then((res) => {
        account.logout;
        account.login(res.data.token);
        successToast("회원 정보가 수정되었습니다");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          errorToast("비밀번호가 다릅니다");
        } else {
          errorToast("회원 정보 수정 중 문제가 발생했습니다");
        }
      })
      .finally(() => {
        setOldPassword("");
        onClose();
        setIsLoading(false);
      });
  }

  function handleDuplicated() {
    axios
      .get(`/api/users/nickNames?nickName=${user.nickName}`)
      .then(() => {
        errorToast("이미 존재하는 닉네임입니다");
      })
      .catch(() => {
        successToast("사용 가능한 닉네임입니다");
        setIsCheckedNickName(true);
      });
  }

  if (user === null) {
    return <Spinner />;
  }

  let disabledNickNameCheckButton = true;
  let disabled = false;
  let isPasswordCheck = user.password === passwordCheck;

  if (user.nickName === oldNickName) {
    disabledNickNameCheckButton = false;
  }

  if (user.nickName.length === 0) {
    disabledNickNameCheckButton = false;
  }

  if (!isCheckedNickName) {
    disabled = true;
  }

  if (!isPasswordCheck) {
    disabled = true;
  }

  if (!disabledNickNameCheckButton) {
    disabled = true;
  }

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>이메일 주소</FormLabel>
          <Input
            variant="flushed"
            placeholer={"변경 불가"}
            readOnly
            value={user.email}
          />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input
            variant="flushed"
            placeholder={"변경 시에만 입력해주세요"}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input
            variant="flushed"
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {isPasswordCheck || (
            <FormHelperText>비밀번호가 일치하지 않습니다</FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <InputGroup>
            <Input
              variant="flushed"
              placeholer={"닉네임 중복 확인 필수"}
              value={user.nickName}
              onChange={(e) => {
                setUser({ ...user, nickName: e.target.value });
                setIsCheckedNickName(false);
              }}
            />
            <InputRightElement>
              <Button
                onClick={handleDuplicated}
                isDisabled={!disabledNickNameCheckButton}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button onClick={onOpen} isDisabled={disabled}>
          수정
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>수정하시겠습니까?</ModalHeader>
          <ModalBody>비밀번호를 입력해주세요</ModalBody>
          <ModalFooter>
            <Input
              variant="flushed"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleUserUpdate} isLoading={isLoading}>
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
