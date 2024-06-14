import { Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  // TODO. 머지 전에 navbar userInfo 삭제

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
          onClick={() => navigate(`/shop/${account.id}/products`)}
          cursor="pointer"
        >
          MyPage
        </Center>
      )}
      <Center onClick={() => navigate(`/shop/${account.id}/userInfo`)}>
        userInfo
      </Center>
    </Flex>
  );
}
