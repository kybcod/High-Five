import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { ProductGrid } from "./ProductGrid.jsx";
import RecommendProductSlider from "../component/slider/RecommendProductSlider.jsx";

export function MainProduct() {
  const [productList, setProductList] = useState(null);
  const [todayProduct, setTodayProduct] = useState(null);
  const [recommendProduct, setRecommendProduct] = useState(null);
  const navigate = useNavigate();
  const [likes, setLikes] = useState({});
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/products`).then((res) => {
      console.log(res.data);
      const products = res.data.products;
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
      setTodayProduct(res.data.todayProduct);
      setRecommendProduct(res.data.recommendProduct);
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

  if (
    productList === null ||
    todayProduct === null ||
    recommendProduct === null
  ) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box h="350px" w="100%" boxSizing="border-box" mx="auto">
        {/*<MainSlider />*/}
      </Box>
      {/* 오늘의 상품 */}
      {/*<Box position="relative" marginY="20">*/}
      {/*  <Divider border={"1px solid teal"} />*/}
      {/*  <AbsoluteCenter fontSize={"2xl"} fontWeight={"bold"} bg="white" px="4">*/}
      {/*    📣 오늘의 경매 상품*/}
      {/*  </AbsoluteCenter>*/}
      {/*</Box>*/}

      <Box position="relative" marginY="10">
        <Text fontSize={"larger"} fontWeight={"bold"}>
          오늘의 경매 상품
        </Text>
        <Text fontSize={"medium"} fontWeight={"bold"}>
          Today Auction Product
        </Text>
      </Box>

      <Box>
        <ProductGrid
          productList={todayProduct}
          likes={likes}
          handleLikeClick={handleLikeClick}
          account={account}
        />
      </Box>

      {/*추천 상품*/}

      <RecommendProductSlider
        recommendProduct={recommendProduct}
        likes={likes}
        handleLikeClick={handleLikeClick}
        account={account}
      />

      {/*전체상품 */}

      <Box position="relative" marginY="10">
        <Text fontSize={"larger"} fontWeight={"bold"}>
          카테고리별 상품
        </Text>
        <Text fontSize={"medium"} fontWeight={"bold"}>
          Today Auction Product
        </Text>
      </Box>

      {/*<Box position="relative" marginY="20">*/}
      {/*  <Divider border={"1px solid teal"} />*/}
      {/*  <AbsoluteCenter fontSize={"2xl"} fontWeight={"bold"} bg="white" px="4">*/}
      {/*    전체 상품*/}
      {/*  </AbsoluteCenter>*/}
      {/*</Box>*/}
      {/*<Box>*/}
      {/*  <ProductGrid*/}
      {/*    productList={productList}*/}
      {/*    likes={likes}*/}
      {/*    handleLikeClick={handleLikeClick}*/}
      {/*    account={account}*/}
      {/*  />*/}
      {/*</Box>*/}
    </Box>
  );
}
