import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

export function MyShop() {
  const { userId } = useParams();
  const [productList, setProductList] = useState(null);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasNextPage, setHasNextPage] = useState(true);
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    axios
      .get(`/api/products/user/${userId}?page=${currentPage}`)
      .then((res) => {
        console.log(res.data);
        if (currentPage === 1) {
          // 첫 번째 페이지
          setProductList(res.data.productList);
        } else {
          // 이후 페이지 : 기존 리스트에 추가
          setProductList((prevList) => [...prevList, ...res.data.productList]);
        }
        setPageInfo(res.data.pageInfo);
        setHasNextPage(res.data.hasNextPage);
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
      });
  }, [searchParams]);

  function handleMoreClick() {
    if (!hasNextPage) return;

    const currentPage = parseInt(searchParams.get("page") || "1");
    searchParams.set("page", currentPage + 1);
    setSearchParams(searchParams);
  }

  function handleFoldClick() {
    const scrollDuration = 500;
    setTimeout(() => {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    }, scrollDuration);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (productList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      {productList.length === 0 ? (
        <Text align="center" fontSize="xl" fontWeight="bold" mt={4}>
          판매한 상품이 없습니다.
        </Text>
      ) : (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={6}
        >
          {productList.map((product) => (
            <GridItem key={product.id}>
              <Card
                cursor={"pointer"}
                maxW="sm"
                h="100%"
                borderWidth="1px"
                borderColor={"#eee"}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              >
                <CardBody position={"relative"} h={"100%"}>
                  <Box mt={2} w="30%%">
                    {/*판매 상태 true 이면 이미지, endTime Badge*/}
                    {/*판매 상태 False 이면 판매완료 이미지, 낙찰자 Badge*/}
                    {product.status ? (
                      <>
                        {product.productFileList && (
                          <Image
                            onClick={() => navigate(`/product/${product.id}`)}
                            src={product.productFileList[0].filePath}
                            borderRadius={"lg"}
                            w={"100%"}
                            h={"200px"}
                          />
                        )}
                        <Badge
                          position={"absolute"}
                          top={"1"}
                          left={"1"}
                          colorScheme={"teal"}
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
                        {product.productBidList &&
                          product.productBidList.length > 0 && (
                            <Badge
                              cursor={"pointer"}
                              position={"absolute"}
                              top={"1"}
                              left={"1"}
                              colorScheme={"teal"}
                              onClick={() => {
                                navigate(
                                  `/chat/product/${product.id}/buyer/${product.productBidList[0].successBidUserId}`,
                                );
                              }}
                            >
                              낙찰자 :{" "}
                              {product.productBidList[0].successBidNickName}
                            </Badge>
                          )}
                        {(!product.productBidList ||
                          product.productBidList.length === 0) && (
                          <Badge
                            position={"absolute"}
                            top={"1"}
                            left={"1"}
                            colorScheme={"teal"}
                          >
                            <Text>낙찰자가 없습니다.</Text>
                          </Badge>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Text mt={2} as={"b"} noOfLines={1} fontSize="lg">
                    {product.title}
                  </Text>
                  <Flex justifyContent={"space-between"}>
                    <Text color="blue.600" fontSize="xl">
                      {product.startPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      원
                    </Text>
                    <Text>{product.timeFormat}</Text>
                  </Flex>
                  {product.status || (
                    <Box display="flex" justifyContent="center">
                      <Button mt={2} w={"100%"} colorScheme={"green"}>
                        상품 후기
                      </Button>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}
      {productList.length > 0 && (
        <Box display={"flex"} justifyContent={"center"}>
          {hasNextPage ? (
            <Button
              w={"30%"}
              colorScheme={"blue"}
              mt={4}
              onClick={handleMoreClick}
              rightIcon={<ArrowDownIcon />}
            >
              더보기
            </Button>
          ) : (
            productList.length > 9 && (
              <Button
                w={"30%"}
                colorScheme={"blue"}
                mt={4}
                rightIcon={<ChevronUpIcon />}
                onClick={handleFoldClick}
              >
                접기
              </Button>
            )
          )}
        </Box>
      )}
    </Box>
  );
}
