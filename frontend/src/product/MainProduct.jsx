import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Spinner, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import ProductSlider from "../component/slider/ProductSlider.jsx";
import { Category } from "../component/category/Category.jsx";
import LivePopularProductSlider from "./main/LivePopularProductSlider.jsx";

export function MainProduct() {
  const [productList, setProductList] = useState(null);
  const [todayProduct, setTodayProduct] = useState(null);
  const [recommendProduct, setRecommendProduct] = useState(null);
  const [livePopularProduct, setLivePopularProduct] = useState(null);
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
      setLivePopularProduct(res.data.livePopularProduct);
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
    recommendProduct === null ||
    livePopularProduct === null
  ) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box h="350px" w="100%" boxSizing="border-box" mx="auto">
        {/*<MainSlider />*/}
      </Box>

      {/*오늘의 경매 상품*/}
      <Box marginY="36" textAlign="center">
        <Text fontSize={"xl"} fontWeight={"bold"} mb={3}>
          🔥 오늘의 경매 상품
        </Text>
        <Text fontSize={"smaller"} color={"gray"} mb={3}>
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
      <Box marginY="36" textAlign="center">
        <Text fontSize={"xl"} fontWeight={"bold"} mb={3}>
          📣 추천 상품
        </Text>
        <Text fontSize={"smaller"} color={"gray"} mb={3}>
          오늘은 이거다!
        </Text>
        <ProductSlider
          product={recommendProduct}
          likes={likes}
          handleLikeClick={handleLikeClick}
          account={account}
        />
      </Box>

      {/*실시간 판매 랭킹  */}
      <Box marginY="36" textAlign="center">
        <Text fontSize={"xl"} fontWeight={"bold"} mb={3}>
          🏆 실시간 경매 참여 랭킹 🏆
        </Text>
        <Text fontSize={"smaller"} color={"gray"} mb={3}>
          핫하다 핫해!
        </Text>
        <LivePopularProductSlider
          product={livePopularProduct}
          likes={likes}
          handleLikeClick={handleLikeClick}
          account={account}
        />
      </Box>

      {/*카테고리 상품 */}
      <Category />
    </Box>
  );
}
