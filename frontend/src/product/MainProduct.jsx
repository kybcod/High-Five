import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AbsoluteCenter, Box, Divider, Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { ProductGrid } from "./ProductGrid.jsx";

export function MainProduct() {
  const [productList, setProductList] = useState(null);
  const [todayProduct, setTodayProduct] = useState(null);
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
      <Box mt={10} h="350px" w="100%" mb={10} boxSizing="border-box" mx="auto">
        {/*<MainSlider />*/}
      </Box>

      {/* 오늘의 상품 */}
      <Box position="relative" marginY="20">
        <Divider border={"1px solid gray"} />
        <AbsoluteCenter fontWeight={"bold"} bg="white" px="4">
          오늘의 경매 상품
        </AbsoluteCenter>
      </Box>
      {todayProduct === null || todayProduct.length === 0 || (
        <Box>
          <ProductGrid
            productList={todayProduct}
            likes={likes}
            handleLikeClick={handleLikeClick}
            account={account}
          />
        </Box>
      )}

      <Box position="relative" marginY="20">
        <Divider border={"1px solid gray"} />
        <AbsoluteCenter fontWeight={"bold"} bg="white" px="4">
          상품 추천
        </AbsoluteCenter>
      </Box>

      <Box>
        <ProductGrid
          productList={productList}
          likes={likes}
          handleLikeClick={handleLikeClick}
          account={account}
        />
      </Box>
    </Box>
  );
}
