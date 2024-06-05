import { Box, Center, Flex } from "@chakra-ui/react";
import React from "react";

export function Category() {
  return (
    <Box bg="gray.200" p={4}>
      <Flex justify="space-around">
        <Center>의류</Center>
        <Center>잡화</Center>
        <Center>식품</Center>
        <Center>디지털</Center>
        <Center>스포츠</Center>
        <Center>e-쿠폰</Center>
      </Flex>
    </Box>
  );
}
