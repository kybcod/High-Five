import { Box, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <HStack bgColor={"seashell"}>
      <Box onClick={() => navigate("/")}>HOME</Box>
      <Box onClick={() => navigate("/write")}>upload</Box>
      <Box onClick={() => navigate("/question")} cursor="pointer">
        QnA
      </Box>
    </HStack>
  );
}
