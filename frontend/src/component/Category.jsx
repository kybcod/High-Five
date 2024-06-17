import { Box, Center, Grid } from "@chakra-ui/react";
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
    <Box bg="gray.200" p={4} borderRadius="md">
      <Grid
        templateColumns="repeat(auto-fit, minmax(120px, 1fr))"
        gap={2}
        justifyItems="center"
        cursor="pointer"
      >
        <Center
          onClick={() => handleCategoryClick("")}
          fontWeight="bold"
          _hover={{ color: "blue.500" }}
        >
          전체
        </Center>
        <Center
          onClick={() => handleCategoryClick("clothes")}
          fontWeight="bold"
          _hover={{ color: "blue.500" }}
        >
          의류
        </Center>
        <Center
          onClick={() => handleCategoryClick("goods")}
          fontWeight="bold"
          _hover={{ color: "blue.500" }}
        >
          잡화
        </Center>
        <Center
          onClick={() => handleCategoryClick("food")}
          fontWeight="bold"
          _hover={{ color: "blue.500" }}
        >
          식품
        </Center>
        <Center
          onClick={() => handleCategoryClick("digital")}
          fontWeight="bold"
          _hover={{ color: "blue.500" }}
        >
          디지털
        </Center>
        <Center
          onClick={() => handleCategoryClick("sport")}
          fontWeight="bold"
          _hover={{ color: "blue.500" }}
        >
          스포츠
        </Center>
        <Center
          onClick={() => handleCategoryClick("e-coupon")}
          fontWeight="bold"
          _hover={{ color: "blue.500" }}
        >
          e-쿠폰
        </Center>
      </Grid>
    </Box>
  );
}
