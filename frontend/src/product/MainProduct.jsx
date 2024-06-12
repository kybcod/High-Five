import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  Card,
  CardBody,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Category } from "../component/Category.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";

export function MainProduct() {
  const [productList, setProductList] = useState(null); // 초기값을 null로 설정
  const navigate = useNavigate();
  const [likes, setLikes] = useState({});
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/products`).then((res) => {
      console.log(res.data);
      const products = res.data;
      const initialLikes = products.reduce((acc, product) => {
        acc[product.id] = product.like || false;
        return acc;
      }, {});

      if (account?.id) {
        axios.get(`/api/products/like/${account.id}`).then((res) => {
          res.data.forEach((productId) => {
            initialLikes[productId] = true;
          });
          setLikes(initialLikes);
        });
      }

      setProductList(products);
    });
  }, [account]);

  function handleLikeClick(productId) {
    axios
      .put("/api/products/like", {
        productId: productId,
      })
      .then((res) => {
        setLikes((prevLikes) => ({
          ...prevLikes,
          [productId]: res.data.like,
        }));
      })
      .catch((error) => {
        console.error("Failed to update like status", error);
      });
  }

  if (productList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Category />
      <Center w="100%">
        <Box h={"100px"} border={"1px solid black"}>
          <Box>이미지 배너</Box>
        </Box>
      </Center>
      <Heading my={4}>오늘의 상품</Heading>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        {productList.map((product) => (
          <GridItem key={product.id}>
            <Card maxW="sm" h="100%">
              <CardBody position="relative" h="100%">
                <Box mt={2} w="100%">
                  {product.status ? (
                    <>
                      {product.productFileList &&
                        product.productFileList[0] && (
                          <Image
                            onClick={() => navigate(`/product/${product.id}`)}
                            src={product.productFileList[0].filePath}
                            borderRadius="lg"
                            w="100%"
                            h="200px"
                          />
                        )}
                      <Badge
                        position="absolute"
                        top="1"
                        left="1"
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
                <Stack mt="6" spacing="3">
                  <Flex justifyContent={"space-between"}>
                    <Text as={"b"} noOfLines={1} fontSize="lg">
                      {product.title}
                    </Text>

                    {account.isLoggedIn() && (
                      <Box onClick={() => handleLikeClick(product.id)}>
                        {(() => {
                          const isLiked = likes[product.id];
                          const icon = isLiked ? fullHeart : emptyHeart;
                          return (
                            <FontAwesomeIcon
                              icon={icon}
                              style={{ color: "red" }}
                              cursor="pointer"
                              size="xl"
                            />
                          );
                        })()}
                      </Box>
                    )}
                  </Flex>
                  <Flex justifyContent={"space-between"}>
                    <Text color="blue.600" fontSize="xl">
                      {product.startPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
    </Box>
  );
}
