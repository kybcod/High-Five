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
  Stack,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function ProductGrid({ productList, likes, handleLikeClick, account }) {
  const navigate = useNavigate();

  return (
    <Grid templateColumns={"repeat(5, 1fr)"} gap={6}>
      {productList.map((product) => (
        <GridItem key={product.id}>
          <Card
            cursor={"pointer"}
            maxW="sm"
            h="100%"
            borderRadius="0"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          >
            <CardBody position="relative" h="100%">
              <Box mt={2} w="100%">
                {product.status ? (
                  <>
                    {product.productFileList && (
                      <Image
                        onClick={() => navigate(`/product/${product.id}`)}
                        src={product.productFileList[0].filePath}
                        w="100%"
                        h="200px"
                      />
                    )}
                    <Badge
                      position="absolute"
                      top="1.5"
                      left="2"
                      colorScheme="teal"
                    >
                      {product.endTimeFormat}
                    </Badge>
                  </>
                ) : (
                  <Box position={"relative"} w={"100%"} h={"200px"}>
                    <Image
                      src={product.productFileList[0].filePath}
                      borderRadius="lg"
                      w="100%"
                      h="200px"
                      filter="brightness(50%)"
                      position="absolute"
                      top="0"
                      left="0"
                    />
                    <Text
                      onClick={() => navigate(`/product/${product.id}`)}
                      cursor={"pointer"}
                      borderRadius="lg"
                      w="100%"
                      h="200px"
                      position="absolute"
                      top="0"
                      left="0"
                      color={"white"}
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      fontSize={"2xl"}
                      as="b"
                    >
                      판매완료
                    </Text>
                  </Box>
                )}
              </Box>
              <Stack mt="4" spacing="2">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    noOfLines={1}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.title}
                  </Text>
                  {account.isLoggedIn() && (
                    <Box onClick={() => handleLikeClick(product.id)}>
                      <FontAwesomeIcon
                        icon={likes[product.id] ? fullHeart : emptyHeart}
                        style={{ color: "red" }}
                        cursor="pointer"
                        size="lg"
                      />
                    </Box>
                  )}
                </Flex>
                <Flex justifyContent="space-between">
                  <Text color="blue.600" fontSize="xl">
                    {product.startPrice
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    원
                  </Text>
                  <Text>{product.timeFormat}</Text>
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </GridItem>
      ))}
    </Grid>
  );
}
