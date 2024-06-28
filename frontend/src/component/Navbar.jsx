import {
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faHeadset, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navbar.css";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex
      borderBottom={"1px solid gray"}
      h={"50px"}
      p={4}
      justifyContent={"space-between"}
      align="center"
      fontSize={"lg"}
      cursor={"pointer"}
    >
      <Box
        className="dropdown"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
        {isHovered && (
          <Box
            className="dropdown-content"
            fontSize={"0.9rem"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Link to="/question/faq">FAQ</Link>
            <Link to="/question/list">1:1 문의게시판</Link>
          </Box>
        )}
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
