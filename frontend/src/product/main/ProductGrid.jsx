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
    <Grid templateColumns={"repeat(4, 1fr)"} gap={20}>
      {productList.map((product) => (
        <GridItem key={product.id}>
          <Card
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
                  onClick={() => navigate(`/product/${product.id}`)}
                  src={product.productFileList[0].filePath}
                  w="100%"
                  h="250px"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                />
                {account.isLoggedIn() && (
                  <Box
                    position="absolute"
                    bottom={2}
                    right={2}
                    onClick={() => handleLikeClick(product.id)}
                  >
                    <FontAwesomeIcon
                      icon={likes[product.id] ? fullHeart : emptyHeart}
                      style={{ color: "red" }}
                      size="xl"
                    />
                  </Box>
                )}
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
                <Text fontSize="xl" fontWeight="bold" noOfLines={1} mb={1}>
                  {product.title}
                </Text>
                <Text fontSize="xl" mb={2} fontWeight={"bold"}>
                  ₩{" "}
                  {product.startPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Text>
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
