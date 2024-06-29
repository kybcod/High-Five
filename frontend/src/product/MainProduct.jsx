import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import ProductSlider from "../component/slider/ProductSlider.jsx";
import { Category } from "../component/category/Category.jsx";

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

      {/*오늘의 경매 상품*/}
      <Box position="relative" marginY="20" textAlign="center">
        <Text fontSize={"xl"} fontWeight={"bold"}>
          🔥 오늘의 경매 상품
        </Text>
        <Text fontSize={"smaller"} color={"gray"}>
          오늘 아니면 놓치는 구매 찬스!
        </Text>
        {/*상품*/}
        <ProductSlider
          product={todayProduct}
          likes={likes}
          handleLikeClick={handleLikeClick}
          account={account}
        />
      </Box>

      {/*추천 상품*/}
      <Box>
        <Text fontSize={"larger"} fontWeight={"bold"}>
          📣 추천 상품
        </Text>
        <Text fontSize={"medium"} fontWeight={"bold"} mb={10}>
          Recommend Product
        </Text>
        <ProductSlider
          product={recommendProduct}
          likes={likes}
          handleLikeClick={handleLikeClick}
          account={account}
        />
      </Box>

      {/*실시간 판매 랭킹  */}
      <Box position="relative" marginY="10">
        <Text fontSize={"larger"} fontWeight={"bold"}>
          🏆 실시간 판매 랭킹 🏆
        </Text>
        <Text fontSize={"medium"} fontWeight={"bold"}>
          Today Auction Product
        </Text>
      </Box>

      {/*카테고리 상품 */}
      <Category />

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
