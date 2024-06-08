import { Center, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <Flex bgColor={"lightgreen"}>
      <Center onClick={() => navigate("/")}>HOME</Center>
      <Center onClick={() => navigate("/write")}>upload</Center>
      <Center onClick={() => navigate("/signup")}>signup</Center>
      <Center onClick={() => navigate("/login")}>login</Center>
    </Flex>
  );
}
