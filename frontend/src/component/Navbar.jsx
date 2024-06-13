import { Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex gap={2} bgColor={"lightgreen"} cursor={"pointer"}>
      <Center onClick={() => navigate("/")}>HOME</Center>
      {account.isLoggedIn() && (
        <Center onClick={() => navigate("/write")}>upload</Center>
      )}
      {account.isLoggedIn() || (
        <Center onClick={() => navigate("/signup")}>signup</Center>
      )}
      {account.isLoggedIn() || (
        <Center onClick={() => navigate("/login")}>login</Center>
      )}
      {account.isLoggedIn() && (
        <Center onClick={() => account.logout()}>logout</Center>
      )}
      {account.isLoggedIn() && (
        <Center>
          <FontAwesomeIcon icon={faUser} />
          {account.nickName} 님
        </Center>
      )}
      <Center onClick={() => navigate("/question")} cursor="pointer">
        QnA
      </Center>
      {account.isLoggedIn() && (
        <Center
          onClick={() => navigate(`/shop/${account.id}/products`)}
          cursor="pointer"
        >
          MyPage
      {account.isLoggedIn() || (
        <Center onClick={() => navigate("/question/list")} cursor="pointer">
          QnA
        </Center>
      )}
      <Center onClick={() => navigate("/chat")} cursor="pointer">
        Chat
      </Center>
      <Center onClick={() => navigate("/user/auth")}>권한 확인</Center>
    </Flex>
  );
}
