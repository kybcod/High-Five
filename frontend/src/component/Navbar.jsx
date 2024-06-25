import { Box, Center, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import {
  faClipboardList,
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

      {account.isAdmin() && (
        <Center onClick={() => navigate("/user/list")} mx={2}>
          <FontAwesomeIcon icon={faUsers} />
          <Text ml={2}>USER LIST</Text>
        </Center>
      )}
      <Spacer />
      {account.isLoggedIn() ? (
        <>
          <Center mx={2} onClick={() => navigate(`/myPage/${account.id}`)}>
            <Box mx={1}>
              <Image
                boxSize="50px"
                src={account.profileImage}
                fallbackSrc="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800"
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
