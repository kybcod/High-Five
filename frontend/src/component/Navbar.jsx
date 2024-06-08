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
    <Flex gap={2} bgColor={"lightgreen"}>
      <Center onClick={() => navigate("/")}>HOME</Center>
      <Center onClick={() => navigate("/write")}>upload</Center>
      <Center onClick={() => navigate("/signup")}>signup</Center>
      <Center onClick={() => navigate("/login")}>login</Center>
      <Center onClick={() => account.logout()}>logout</Center>
      <Center>
        <FontAwesomeIcon icon={faUser} />
        {account.nickName} 님
      </Center>
    </Flex>
  );
}
