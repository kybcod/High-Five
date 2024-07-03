import { Box, Center, Flex, Spacer, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import {
  faClipboardQuestion,
  faHeadset,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./css/Navbar.css";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
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

      <Spacer />
      {account.isAdmin() && (
        <>
          <Center onClick={() => navigate("/user/list")} mx={2}>
            <Text fontSize={"small"} mr={3}>
              회원 목록
            </Text>
          </Center>
          <Box height="24px" borderLeft="1px solid #ccc" />
        </>
      )}
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
          <Center fontSize={"small"} onClick={() => navigate("/login")} mx={2}>
            <Text ml={2}>회원가입 / 로그인</Text>
          </Center>
        </>
      )}
    </Flex>
  );
}
