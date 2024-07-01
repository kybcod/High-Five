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
import LoadMoreAndFoldButton from "./customButton/LoadMoreAndFoldButton.jsx";
import { SortButton } from "./customButton/SortButton.jsx";

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
        setSortOption(shopSort.toString());
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
      <SortButton sortOption={sortOption} handleSortChange={handleSortChange} />

      {productList.length === 0 ? (
        <Text align="center" fontSize="xl" fontWeight="bold" mt={4}>
          판매한 상품이 없습니다.
        </Text>
      ) : (
        <Grid templateColumns={"repeat(3, 1fr)"} gap={16}>
          {productList.map((product) => (
            <GridItem key={product.id}>
              <Card
                onClick={() => navigate(`/product/${product.id}`)}
                w={"100%"}
                boxShadow={"none"}
                borderColor={"gray.200"}
                borderWidth={"1px"}
                cursor={"pointer"}
                maxW="sm"
                h={"auto"} // 판매 중인 상품은 자동 높이, 종료된 상품은 100% 높이
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <CardBody position={"relative"} p={0}>
                  <Box position="relative">
                    <Image
                      src={product.productFileList[0].filePath}
                      w={"100%"}
                      h={"250px"}
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.02)" }}
                    />
                    {!product.status && (
                      <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
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
                  <Box p={4}>
                    <Text fontSize="lg" fontWeight="500" noOfLines={1} mb={1}>
                      {product.title}
                    </Text>
                    <Flex mb={1} alignItems="baseline">
                      <Text
                        fontSize={
                          product.startPrice.toString().length > 8
                            ? "sm"
                            : product.startPrice.toString().length > 6
                              ? "md"
                              : "lg"
                        }
                        fontWeight="bold"
                        mr={2}
                      >
                        {product.startPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                        원
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        (시작가)
                      </Text>
                    </Flex>
                    <Badge
                      colorScheme={product.status ? "yellow" : "purple"}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {product.status
                        ? product.endTimeFormat
                        : product.productBidList &&
                            product.productBidList.length > 0
                          ? `낙찰자: ${product.productBidList[0].successBidNickName}`
                          : "낙찰자가 없습니다."}
                    </Badge>
                    {!product.status && (
                      <Box display="flex" justifyContent="center">
                        <Button
                          mt={2}
                          w={"100%"}
                          variant={"outline"}
                          borderWidth={3}
                          colorScheme={"teal"}
                          color={"teal"}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          상품 후기
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}

      {/*더보기 접기 버튼*/}
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
