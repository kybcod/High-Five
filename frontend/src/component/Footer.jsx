import { Center, Flex } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      bg="green.500"
      color="white"
      p={4}
      align="center"
      h={20}
      fontSize={"lg"}
      cursor={"pointer"}
    >
      <Center>footer</Center>
    </Flex>
  );
}
