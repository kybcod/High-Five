// src/component/MainProduct.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Box, Center, Heading, Spinner } from "@chakra-ui/react";
import { Category } from "../component/Category.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { ProductGrid } from "./ProductGrid.jsx";

export function MainProduct() {
  const [productList, setProductList] = useState(null);
  const [likes, setLikes] = useState({});
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/products`).then((res) => {
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
        <Box mt={2} w="100%">
          {/*<MainSlider />*/}
        </Box>
      </Center>
      <Heading my={4}>오늘의 상품</Heading>
      <ProductGrid
        productList={productList}
        likes={likes}
        handleLikeClick={handleLikeClick}
        account={account}
      />
    </Box>
  );
}
