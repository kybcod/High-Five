import { Box, Center, Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Category() {
  const [category, setCategory] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  function handleCategoryClick(category) {
    searchParams.set("category", category);
    setSearchParams(searchParams);
    navigate(`?${searchParams}`);
  }

  return (
    <Box bg="gray.200" p={4}>
      <Flex justify="space-around" cursor={"pointer"}>
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
