import { Box, Center, Flex, Spacer, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex
      border={"1px solid black"}
      h={"10px"}
      p={4}
      justifyContent={"space-between"}
      align="center"
      fontSize={"lg"}
      cursor={"pointer"}
    >
      <Center onClick={() => navigate("/board/list")} mx={2}>
        <Text fontSize={"small"} ml={2}>
          자유게시판
        </Text>
      </Center>
      <Center
        onClick={() => navigate("/question/list")}
        cursor="pointer"
        mx={2}
      >
        <Text fontSize={"small"} ml={2}>
          QnA
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
