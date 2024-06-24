import { Box, Center, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import {
  faClipboardList,
  faHome,
  faQuestionCircle,
  faSignInAlt,
  faSignOutAlt,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      bg="green.500"
      color="white"
      p={4}
      align="center"
      h={20}
      fontSize={"lg"}
      cursor={"pointer"}
    >
      <Center onClick={() => navigate("/")} mx={2}>
        <FontAwesomeIcon icon={faHome} />
        <Text ml={2}>HOME</Text>
      </Center>
      <Center onClick={() => navigate("/board/list")} mx={2}>
        <FontAwesomeIcon icon={faClipboardList} />
        <Text ml={2}>자유게시판</Text>
      </Center>
      <Center
        onClick={() => navigate("/question/list")}
        cursor="pointer"
        mx={2}
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
        <Text ml={2}>QnA</Text>
      </Center>

      <Center onClick={() => navigate("/user/list")} mx={2}>
        <FontAwesomeIcon icon={faUsers} />
        <Text ml={2}>USER LIST</Text>
      </Center>
      <Spacer />
      {account.isLoggedIn() ? (
        <>
          <Center mx={2} onClick={() => navigate(`/myPage/${account.id}`)}>
            <Box mx={1}>
              <Image
                boxSize="50px"
                src={account.profileImage}
                fallbackSrc="https://study34980.s3.ap-northeast-2.amazonaws.com/prj3/profile/original_profile.jpg"
                borderRadius="full"
              />
            </Box>
            <Text ml={2}>{account.nickName} 님</Text>
          </Center>
          <Center
            onClick={() => {
              account.logout();
              navigate("/");
            }}
            cursor="pointer"
            mx={2}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <Text ml={2}>LOGOUT</Text>
          </Center>
        </>
      ) : (
        <>
          <Center onClick={() => navigate("/login")} mx={2}>
            <FontAwesomeIcon icon={faSignInAlt} />
            <Text ml={2}>LOGIN</Text>
          </Center>
          <Center onClick={() => navigate("/signup")} mx={2}>
            <FontAwesomeIcon icon={faUserPlus} />
            <Text ml={2}>SIGNUP</Text>
          </Center>
        </>
      )}
    </Flex>
  );
}
