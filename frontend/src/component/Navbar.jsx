import { Box, Center, Flex, Spacer, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import {
  faClipboardQuestion,
  faHeadset,
  faQuestion,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      // bgColor={"#99D8AF"} // 원래 색
      // bgColor={"#05a482"} // 약간 진한 초록색
      h={"30px"}
      p={4}
      justifyContent={"space-between"}
      align="center"
      fontSize={"lg"}
      cursor={"pointer"}
    >
      <Box className="dropdown">
        <Center
          onClick={() => navigate("/question/faq")}
          cursor="pointer"
          mx={2}
        >
          <FontAwesomeIcon size={"sm"} icon={faHeadset} />
          <Text fontSize={"small"} ml={1}>
            고객센터
          </Text>
        </Center>
        <Box className="dropdown-content" fontSize={"0.9rem"}>
          <Link to="/question/faq">
            <FontAwesomeIcon icon={faQuestion} /> &nbsp; FAQ
          </Link>
          <Link to="/question/list">
            <FontAwesomeIcon icon={faClipboardQuestion} />
            &nbsp;1:1 문의게시판
          </Link>
        </Box>
      </Box>
      <Center onClick={() => navigate("/board/list")} mx={2}>
        <Text fontSize={"small"} ml={2}>
          자유게시판
        </Text>
      </Center>

      {account.isAdmin() && (
        <Center onClick={() => navigate("/user/list")} mx={2}>
          <FontAwesomeIcon icon={faUsers} />
          <Text fontSize={"small"} ml={2}>
            회원 목록
          </Text>
        </Center>
      )}
      <Spacer />
      {account.isLoggedIn() ? (
        <>
          <Center
            onClick={() => {
              account.logout();
              navigate("/");
            }}
            cursor="pointer"
            mx={2}
          >
            <Text fontSize={"small"} ml={2}>
              로그아웃
            </Text>
          </Center>
        </>
      ) : (
        <>
          <Center onClick={() => navigate("/signup")} mx={2}>
            <Text fontSize={"small"} ml={2}>
              회원 가입
            </Text>
          </Center>
          <Box
            height="24px"
            borderLeft="1px solid #ccc"
            mx={2}
            alignSelf="center"
          />
          <Center fontSize={"small"} onClick={() => navigate("/login")} mx={2}>
            <Text ml={2}>로그인</Text>
          </Center>
        </>
      )}
    </Flex>
  );
}
