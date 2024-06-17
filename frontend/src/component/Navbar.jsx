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

      {account.isLoggedIn() || (
        <Center onClick={() => navigate("/signup")}>signup</Center>
      )}
      {account.isLoggedIn() || (
        <Center onClick={() => navigate("/login")}>login</Center>
      )}
      {account.isLoggedIn() && (
        <Center
          onClick={() => {
            account.logout();
            navigate("/");
          }}
        >
          logout
        </Center>
      )}
      {account.isLoggedIn() && (
        <Center>
          <FontAwesomeIcon icon={faUser} />
          {account.nickName} 님
        </Center>
      )}
      <Center onClick={() => navigate("/question/list")} cursor="pointer">
        QnA
      </Center>
      {account.isLoggedIn() && (
        <Center
          onClick={() => navigate(`/myPage/${account.id}`)}
          cursor="pointer"
        >
          MyPage
        </Center>
      )}
      <Center onClick={() => navigate("/user/list")}>UserList</Center>
      <Center onClick={() => navigate("/board/list")}>자유게시판</Center>
    </Flex>
  );
}
