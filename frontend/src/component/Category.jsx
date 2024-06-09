import { Box, Center, Flex } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Category() {
  const navigate = useNavigate();

  function handleCategoryClick(category) {
    if (category === "") {
      navigate(`/list`);
    } else {
      navigate(`/list?category=${category}`);
    }
  }

  return (
    <Box bg="gray.200" p={4}>
      <Flex justify="space-around" cursor={"pointer"}>
        <Center onClick={() => handleCategoryClick("")}>전체</Center>
        <Center onClick={() => handleCategoryClick("clothes")}>의류</Center>
        <Center onClick={() => handleCategoryClick("goods")}>잡화</Center>
        <Center onClick={() => handleCategoryClick("food")}>식품</Center>
        <Center onClick={() => handleCategoryClick("digital")}>디지털</Center>
        <Center onClick={() => handleCategoryClick("sport")}>스포츠</Center>
        <Center onClick={() => handleCategoryClick("e-coupon")}>e-쿠폰</Center>
      </Flex>
    </Box>
  );
}
