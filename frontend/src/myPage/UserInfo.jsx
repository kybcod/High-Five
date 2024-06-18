import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";
import ReportButton from "../user/ReportButton.jsx";

export function UserInfo() {
  const account = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPassword, setOldPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/users/${account.id}`).then((res) => {
      setUser(res.data);
    });
  }, []);

  function handleUserDelete() {
    setIsLoading(true);
    axios
      .delete(`/api/users/${account.id}`, { data: { ...user, oldPassword } })
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
      })
      .finally(() => {
        onClose();
        setOldPassword("");
        setIsLoading(false);
      });
  }

  if (user === null) {
    return <Spinner />;
  }

  console.log(user.profileImage.src);

  return (
    <Box>
      <Box>
        <ReportButton userId={user.id} />
        <Image
          fallbackSrc="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800"
          borderRadius="full"
          boxSize="150px"
          src={user.profileImage.src}
        />
        <FormControl>
          <FormLabel>이메일 주소</FormLabel>
          <Input
            variant="flushed"
            placeholer={"변경 불가"}
            readOnly
            value={user.email || ""}
          />
        </FormControl>
        <FormControl>
          <FormLabel>닉네임</FormLabel>
          <Input variant="flushed" readOnly value={user.nickName || ""} />
        </FormControl>
        <FormControl>
          <FormLabel>가입일시</FormLabel>
          <Input variant="flushed" readOnly value={user.signupDateAndTime} />
        </FormControl>
        <Flex gap={3}>
          <Link onClick={() => navigate("/myPage/:userId/userEdit")}>
            회원정보수정
          </Link>
          <Link onClick={onOpen}>회원 탈퇴</Link>
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제하시겠습니까?</ModalHeader>
          <ModalBody>비밀번호를 입력해주세요</ModalBody>
          <ModalFooter>
            <Input
              variant="flushed"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleUserDelete} isLoading={isLoading}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
