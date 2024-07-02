import React from "react";
import {
  Badge,
  Box,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function ProductGrid({ productList, likes, handleLikeClick, account }) {
  const navigate = useNavigate();

  return (
    <Grid templateColumns={"repeat(4, 1fr)"} gap={16}>
      {productList.map((product) => (
        <GridItem key={product.id}>
          <Card
            onClick={() => navigate(`/product/${product.id}`)}
            w={"85%"}
            boxShadow={"none"}
            borderColor={"white"}
            borderWidth={"1px"}
            cursor={"pointer"}
            maxW="sm"
            h="100%"
            borderBottomRadius={"0"}
            overflow="hidden"
          >
            <CardBody position="relative" h="100%" p={0}>
              <Box position="relative">
                <Image
                  src={product.productFileList[0].filePath}
                  w="100%"
                  h="250px"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                />
                {!product.status && (
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="blackAlpha.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontSize="2xl" fontWeight="bold">
                      판매완료
                    </Text>
                  </Box>
                )}
              </Box>
              <Box p={3}>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                  <Text
                    fontSize="lg"
                    fontWeight="500"
                    noOfLines={1}
                    mb={1}
                    mr={1}
                  >
                    {product.title}
                  </Text>
                  {account.isLoggedIn() && (
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeClick(product.id);
                      }}
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.1)" }}
                    >
                      <FontAwesomeIcon
                        icon={likes[product.id] ? fullHeart : emptyHeart}
                        style={{ color: "red" }}
                        size="xl"
                      />
                    </Box>
                  )}
                </Flex>
                <Flex mb={3} alignItems="baseline">
                  <Text fontSize="xl" fontWeight="bold" mr={2}>
                    {product.startPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    원
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    (시작가)
                  </Text>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Badge color={"black"} colorScheme={"yellow"}>
                    {product.endTimeFormat}
                  </Badge>
                </Flex>
              </Box>
            </CardBody>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}
