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
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import LoadMoreAndFoldButton from "../component/LoadMoreAndFoldButton.jsx";

export function MyShop() {
  const { userId } = useParams();
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [sortOption, setSortOption] = useState("0");
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("shopPage") || "1");
    const shopSort = parseInt(searchParams.get("shopSort") || "0");
    axios
      .get(
        `/api/products/user/${userId}?shopPage=${currentPage}&shopSort=${shopSort}`,
      )
      .then((res) => {
        if (currentPage === 1) {
          setProductList(res.data.productList);
        } else {
          setProductList((prevList) => [...prevList, ...res.data.productList]);
        }
        setPageInfo(res.data.pageInfo);
        setHasNextPage(res.data.hasNextPage);
      })
      .catch((error) => {
        console.error("Failed to fetch products", error);
      });
  }, [searchParams]);

  // 새로고침, 다른 페이지 이동 후 다시 돌아왔을 때 페이지1, 최신순으로 재렌더링
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("shopPage") || "1");
    const shopSort = parseInt(searchParams.get("shopSort") || "0");

    if (currentPage > 1 || shopSort > 0) {
      searchParams.set("shopPage", "1");
      searchParams.set("shopSort", "0");
      setSearchParams(searchParams);
    }
  }, []);

  function handleMoreClick() {
    if (!hasNextPage) return;

    const currentPage = parseInt(searchParams.get("shopPage") || "1");
    searchParams.set("shopPage", currentPage + 1);
    setSearchParams(searchParams);
  }

  function handleFoldClick() {
    const scrollDuration = 500;
    setTimeout(() => {
      searchParams.set("shopPage", "1");
      setSearchParams(searchParams);
    }, scrollDuration);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(sortValue) {
    setSortOption(sortValue);
    searchParams.set("shopSort", sortValue);
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <Flex justifyContent={"flex-end"} mb={4}>
        <Button
          fontSize={"small"}
          fontWeight={"normal"}
          color={sortOption === "0" ? "red" : "black"}
          variant="unstyled"
          onClick={() => handleSortChange("0")}
        >
          최신순
        </Button>
        <Box m={2} height="24px" borderLeft="1px solid #ccc" />
        <Button
          variant="unstyled"
          fontWeight={"normal"}
          onClick={() => handleSortChange("1")}
          fontSize={"small"}
          color={sortOption === "1" ? "red" : "black"}
        >
          인기순
        </Button>
        <Box m={2} height="24px" borderLeft="1px solid #ccc" />
        <Button
          variant="unstyled"
          fontWeight={"normal"}
          onClick={() => handleSortChange("2")}
          fontSize={"small"}
          color={sortOption === "2" ? "red" : "black"}
        >
          저가순
        </Button>
        <Box m={2} height="24px" borderLeft="1px solid #ccc" />
        <Button
          variant="unstyled"
          fontWeight={"normal"}
          onClick={() => handleSortChange("3")}
          fontSize={"small"}
          color={sortOption === "3" ? "red" : "black"}
        >
          고가순
        </Button>
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
