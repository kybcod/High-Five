import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardQuestion,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const VerticalLine = ({ height, color, thickness }) => {
  return <Box height={height} width={thickness} bg={color} />;
};

export function UserInfo() {
  const account = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPassword, setOldPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [totalBoardCount, setTotalBoardCount] = useState(0);
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    axios.get(`/api/users/${userId}`).then((res) => {
      setUser(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/question/user/${userId}`).then((res) => {
      setTotalQuestionCount(res.data.totalQuestionCount);
    });
  }, []);

  useEffect(() => {
    axios.get(`/api/user/board/${userId}`).then((res) => {
      console.log(res.data);
      setTotalBoardCount(res.data);
    });
    console.log(totalBoardCount);
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

  return (
    <Box>
      <Box>
        <HStack>
          <Image
            width={"150px"}
            height="150px"
            fallbackSrc="https://study34980.s3.ap-northeast-2.amazonaws.com/prj3/profile/original_profile.jpg"
            borderRadius="full"
            boxSize="150px"
            src={user.profileImage.src}
            mr={7}
            ml={3}
          />
          <VerticalLine height="150px" color="gray.200" thickness="2px" />
          <Box ml={8}>
            <Heading mb={3}>{user.email || ""}</Heading>
            <Text
              color="teal.500"
              onClick={() => navigate("/myPage/:userId/userEdit")}
              as="u"
              cursor="pointer"
            >
              회원정보 수정
            </Text>
          </Box>
        </HStack>
        <FormControl mt={12}>
          <FormLabel fontWeight="bold">닉네임</FormLabel>
          <Input variant="flushed" readOnly value={user.nickName || ""} />
        </FormControl>
        <FormControl mt={12} mb={9}>
          <FormLabel fontWeight="bold">가입일시</FormLabel>
          <Input
            variant="flushed"
            readOnly
            value={user.signupDateAndTime.substring(0, 13)}
          />
        </FormControl>

        <Flex align="center" mt={2} mb={9}>
          <Flex mr={9}>
            <Box mr={2}>
              <FontAwesomeIcon icon={faClipboardQuestion} />
            </Box>
            <Text fontWeight="600">1:1 문의글 {totalQuestionCount} 회</Text>
            &nbsp;
            <Link to={`/question/list?type=nickName&keyword=${user.nickName}`}>
              <Text color="teal.500" as="u" cursor={"pointer"}>
                보러가기
              </Text>
            </Link>
          </Flex>
          <Flex>
            <Box mr={2}>
              <FontAwesomeIcon icon={faUsers} />
            </Box>
            <Text fontWeight="600">
              자유게시판 글 작성 {totalBoardCount} 회
            </Text>
            &nbsp;
            <Link to={`/board/list/?type=nickName&keyword=${user.nickName}`}>
              <Text color="teal.500" as="u" cursor={"pointer"}>
                보러가기
              </Text>
            </Link>
          </Flex>
        </Flex>
        <Text
          color="gray.500"
          onClick={onOpen}
          as="u"
          cursor={"pointer"}
          _hover={{ color: "red.500" }}
        >
          회원 탈퇴
        </Text>
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
              type={"password"}
            />
            <Button
              onClick={handleUserDelete}
              isLoading={isLoading}
              variant="outline"
              colorScheme="teal"
              borderWidth={2}
            >
              삭제
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              colorScheme="teal"
              borderWidth={2}
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
