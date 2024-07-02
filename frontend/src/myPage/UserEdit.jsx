import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
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
import { LoginContext } from "../component/LoginProvider.jsx";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { buttonStyle } from "../component/css/style.js";
import { useNavigate } from "react-router-dom";

const VerticalLine = ({ height, color, thickness }) => {
  return <Box height={height} width={thickness} bg={color} />;
};

export function UserEdit() {
  const account = useContext(LoginContext);
  const [user, setUser] = useState(null);
  const [oldNickName, setOldNickName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();
  const [isCheckedNickName, setIsCheckedNickName] = useState(true);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [profileImages, setProfileImages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { successToast, errorToast } = CustomToast();
  const { onClose, isOpen, onOpen } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/users/${account.id}`).then((res) => {
      const dbUser = res.data;
      setUser({ ...dbUser });
      setOldNickName(dbUser.nickName);
      console.log(user.profileImage.src);
    });
  }, []);

  function handleUserUpdate() {
    setIsLoading(true);
    const userCopy = { ...user };
    delete userCopy.profileImage;
    axios
      .putForm(`/api/users/${account.id}`, {
        ...userCopy,
        oldPassword,
        profileImages,
      })
      .then((res) => {
        account.logout;
        account.login(res.data.token);
        successToast("회원 정보가 수정되었습니다");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          errorToast("비밀번호가 다릅니다");
        } else if (err.response.status === 400) {
          errorToast("사용할 수 없는 비밀번호이거나 닉네임입니다");
        } else {
          errorToast("회원 정보 수정 중 문제가 발생했습니다");
        }
      })
      .finally(() => {
        setOldPassword("");
        onClose();
        setIsLoading(false);
        navigate(`/myPage/${user.id}/userInfo`);
      });
  }

  function handleDuplicated() {
    axios
      .get(`/api/users/nickNames?nickName=${user.nickName}`)
      .then(() => {
        successToast("사용 가능한 닉네임입니다");
        setIsCheckedNickName(true);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("닉네임은 10자까지 입력할 수 있습니다");
        } else if (err.response.status === 409) {
          errorToast("이미 존재하는 닉네임입니다");
        } else {
          errorToast("이메일 조회 중 에러가 발생했습니다");
        }
      });
  }

  if (user === null) {
    return <Spinner />;
  }

  let disabledNickNameCheckButton = true;
  let disabled = false;
  let isPasswordCheck = user.password === passwordCheck;
  const passwordPattern =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,16}$/;

  let isValidPassword = false;
  if (passwordPattern.test(user.password)) {
    isValidPassword = true;
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

  if (!isValidPassword && user.password.length > 0) {
    disabled = true;
  }

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  if (user === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box mt={10}>
        <Heading fontSize={"2xl"}>회원정보 수정</Heading>
        <HStack mt={10} ml={5}>
          <Box mr={7}>
            <Image
              width={"150px"}
              height="150px"
              src={imgFile}
              borderRadius={"full"}
              fallbackSrc={
                !user.profileImage || user.profileImage.src === "null"
                  ? "https://study34980.s3.ap-northeast-2.amazonaws.com/prj3/profile/original_profile.jpg"
                  : user.profileImage.src
              }
            />
            <Center mt={3}>
              <Button
                onClick={() => imgRef.current.click()}
                colorScheme="teal"
                height={"30px"}
                fontSize={"xs"}
              >
                이미지 업로드
              </Button>
            </Center>
            <FormControl mt={7}>
              <Input
                display={"none"}
                type={"file"}
                accept="image/*"
                ref={imgRef}
                onChange={(e) => {
                  setProfileImages(e.target.files);
                  saveImgFile();
                }}
              />
            </FormControl>
          </Box>
          <VerticalLine
            height="180px"
            color="gray.200"
            thickness="2px"
            margin-left={"20px"}
          />
          <Box ml={9}>
            <Heading mb={8}>{user.email || ""}</Heading>
            <Text>변경 시에만 비밀번호와 닉네임을 입력해주세요</Text>
          </Box>
        </HStack>
        <FormControl mt={12}>
          <FormLabel>비밀번호</FormLabel>
          <Input
            type={"password"}
            variant="flushed"
            placeholder={"변경 시에만 입력해주세요"}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          {isValidPassword || (
            <FormHelperText fontSize={"xs"}>
              비밀번호는 8자 이상으로, 영문 대소문자와 숫자, 특수기호를
              포함하여야 합니다
            </FormHelperText>
          )}
        </FormControl>
        <FormControl mt={7}>
          <FormLabel>비밀번호 확인</FormLabel>
          <Input
            type={"password"}
            variant="flushed"
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {isPasswordCheck || (
            <FormHelperText fontSize={"xs"}>
              비밀번호가 일치하지 않습니다
            </FormHelperText>
          )}
        </FormControl>
        <FormControl mt={7}>
          <FormLabel>닉네임</FormLabel>
          <InputGroup size="md">
            <Input
              variant="flushed"
              placeholer={"닉네임 중복 확인 필수"}
              fontSize={"medium"}
              value={user.nickName}
              onChange={(e) => {
                setUser({ ...user, nickName: e.target.value });
                setIsCheckedNickName(false);
              }}
            />
            <InputRightElement width="6rem">
              <Button
                onClick={handleDuplicated}
                isDisabled={!disabledNickNameCheckButton}
                h="2rem"
                size="md"
                colorScheme="teal"
                variant="outline"
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Flex justifyContent={"flex-end"}>
          <Button
            onClick={onOpen}
            isDisabled={disabled}
            mt={10}
            {...buttonStyle}
          >
            수정
          </Button>
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정하시겠습니까?</ModalHeader>
          <ModalBody>비밀번호를 입력해주세요</ModalBody>
          <ModalFooter>
            <Input
              mr={2}
              type={"password"}
              variant="flushed"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Button
              mr={2}
              onClick={handleUserUpdate}
              isLoading={isLoading}
              variant="outline"
              colorScheme="teal"
              borderWidth={2}
            >
              확인
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              colorScheme="gray"
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
