import { Box, Flex, Image, Text } from "@chakra-ui/react";
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

  const CategoryIcons = () => {
    const icons = [
      {
        src: "https://velog.velcdn.com/images/kpo12345/post/eea5266c-da58-4757-8098-5e264c5849e8/image.png",
        category: "",
        label: "전체",
      },
      {
        src: "https://velog.velcdn.com/images/kpo12345/post/8a989e0e-2e8c-4826-8ae4-8341d4adf866/image.png",
        category: "clothes",
        label: "의류",
      },
      {
        src: "https://velog.velcdn.com/images/kpo12345/post/8211034e-699f-48d3-b8a1-bde6b80aa528/image.png",
        category: "goods",
        label: "잡화",
      },
      {
        src: "https://velog.velcdn.com/images/kpo12345/post/0f750a71-2154-4d03-80ba-3fb00af8e778/image.png",
        category: "food",
        label: "식품",
      },
      {
        src: "https://velog.velcdn.com/images/kpo12345/post/981459ec-bc49-49b4-bcfe-42dc9eba27c0/image.png",
        category: "digital",
        label: "디지털",
      },
      {
        src: "https://velog.velcdn.com/images/kpo12345/post/ffe2bf01-4e1d-4e49-90c7-707b1606d868/image.png",
        category: "sport",
        label: "스포츠",
      },
      {
        src: "https://velog.velcdn.com/images/kpo12345/post/cf32da64-e5bf-4d81-9866-a9ae727d2228/image.png",
        category: "e-coupon",
        label: "e-쿠폰",
      },
    ];

    return (
      <Flex position="relative" justifyContent="space-evenly">
        {icons.map((icon, index) => (
          <Box
            cursor={"pointer"}
            key={index}
            borderColor="#A6D57D"
            borderWidth={"1px"}
            borderRadius="10px"
            boxSize="120px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => handleCategoryClick(icon.category)} // 아이콘 클릭 시 handleCategoryClick 호출
            flexDirection="column"
            textAlign="center"
            m={2}
          >
            <Image src={icon.src} boxSize="50%" borderRadius="50%" />
            <Text fontWeight={"bold"} mt={2} fontSize="sm">
              {icon.label}
            </Text>
          </Box>
        ))}
      </Flex>
    );
  };

  return (
    <Box
      mt={20}
      position="relative"
      bgColor={"#F4F4F4"}
      height="300px"
      width="100%"
    >
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Text fontSize={"larger"} fontWeight={"bold"}>
          카테고리 상품
        </Text>
        <Text fontSize={"medium"} fontWeight={"bold"}>
          Category Product
        </Text>
        <Box mt={10} width={"100%"}>
          <CategoryIcons />
        </Box>
      </Flex>
    </Box>
  );
}
