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
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import LoadMoreAndFoldButton from "../component/LoadMoreAndFoldButton.jsx";

export function MyShop() {
  const { userId } = useParams();
  const [productList, setProductList] = useState(null);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [sortOption, setSortOption] = useState(0);
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");
    const sort = parseInt(searchParams.get("sort") || sortOption);
    axios
      .get(`/api/products/user/${userId}?page=${currentPage}&sort=${sort}`)
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

  function handleSortChange(event) {
    setSortOption(parseInt(event.target.value));
    searchParams.set("sort", event.target.value);
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <Flex justifyContent={"flex-end"} mb={4}>
        <Select
          width={"200px"}
          value={sortOption}
          onChange={(e) => handleSortChange(e)}
        >
          <option value="0">최신순</option>
          <option value="1">인기순</option>
          <option value="2">저가순</option>
          <option value="3">고가순</option>
        </Select>
      </Flex>

      {productList.length === 0 ? (
        <Text align="center" fontSize="xl" fontWeight="bold" mt={4}>
          판매한 상품이 없습니다.
        </Text>
      ) : (
        <Grid templateColumns={"repeat(3, 1fr)"} gap={6}>
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
                <CardBody position={"relative"} h={"100%"}>
                  {/* 판매 상태 true 이면 endTime Badge */}
                  {product.status && (
                    <Badge
                      position={"absolute"}
                      top={"1"}
                      left={"1"}
                      colorScheme={"teal"}
                    >
                      {product.endTimeFormat}
                    </Badge>
                  )}
                  {/* 판매 상태 false 이면 낙찰자 Badge */}
                  {!product.status &&
                    product.productBidList &&
                    product.productBidList.length > 0 && (
                      <Badge
                        cursor={"pointer"}
                        position={"absolute"}
                        top={"1"}
                        left={"1"}
                        colorScheme={"purple"}
                        onClick={() => {
                          navigate(
                            `/chat/product/${product.id}/buyer/${product.productBidList[0].successBidUserId}`,
                          );
                        }}
                      >
                        낙찰자 : {product.productBidList[0].successBidNickName}
                      </Badge>
                    )}
                  {!product.status &&
                    (!product.productBidList ||
                      product.productBidList.length === 0) && (
                      <Badge
                        position={"absolute"}
                        top={"1"}
                        left={"1"}
                        colorScheme={"purple"}
                      >
                        <Text>낙찰자가 없습니다.</Text>
                      </Badge>
                    )}

                  <Box mt={2} w="30%%">
                    {/*판매 상태 true 이면 이미지*/}
                    {/*판매 상태 False 이면 판매완료 이미지*/}
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
                  <Text mt={2} as={"b"} noOfLines={1} fontSize="lg">
                    {product.title}
                  </Text>
                  <Flex justifyContent={"space-between"}>
                    <Text color="blue.600" fontSize="lg">
                      {product.startPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      원
                    </Text>
                    <Text>{product.timeFormat}</Text>
                  </Flex>
                  {product.status || (
                    <Box display="flex" justifyContent="center">
                      <Button
                        mt={2}
                        w={"100%"}
                        variant={"outline"}
                        colorScheme={"teal"}
                        borderWidth={3}
                      >
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
          <LoadMoreAndFoldButton
            hasNextPage={hasNextPage}
            productListLength={productList.length}
            onMoreClick={handleMoreClick}
            onFoldClick={handleFoldClick}
          />
        </Box>
      )}
    </Box>
  );
}
