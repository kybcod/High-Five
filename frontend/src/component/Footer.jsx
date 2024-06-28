import { Center, Flex } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      borderTop={"1px solid black"}
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
