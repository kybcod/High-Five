import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "./component/LoginProvider.jsx";

export function UserInfo() {
  const account = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { successToast, errorToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/users/${account.id}`).then((res) => {
      setUser(res.data);
      console.log(res.data);
    });
  }, []);

  function handleUserDelete() {
    axios
      .delete(`/api/users/${account.id}`, { data: { user } })
      .then(() => {
        successToast("회원 탈퇴되었습니다");
        account.logout();
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          errorToast("비밀번호가 다릅니다");
        } else {
          errorToast("회원 탈퇴 중 문제가 발생했습니다");
        }
      });
  }

  if (user === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>이메일 주소</FormLabel>
          <Input placeholer={"변경 불가"} readOnly value={user.email || ""} />
        </FormControl>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input readOnly value={user.nickName || ""} />
        </FormControl>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input readOnly defaultValue={user.inserted} />
        </FormControl>
        <Link onClick={onOpen}>회원 탈퇴</Link>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>삭제하시겠습니까?</ModalHeader>
          <ModalBody>비밀번호를 입력해주세요</ModalBody>
          <ModalFooter>
            <Input
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleUserDelete}>삭제</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
