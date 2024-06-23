import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { Category } from "../component/Category.jsx";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { ProductGrid } from "./ProductGrid.jsx";

export function ProductList() {
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [likes, setLikes] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios.get(`/api/products/search?${searchParams}`).then((res) => {
      const products = res.data.content;
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
      setPageInfo(res.data.pageInfo);
    });
  }, [searchParams, account]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
  }

  function handleLikeClick(productId) {
    axios
      .put(`/api/products/like`, {
        productId: productId,
      })
      .then((res) => {
        setLikes((prevLike) => ({
          ...prevLike,
          [productId]: res.data.like,
        }));
      });
  }

  return (
    <Box>
      <Category />
      <Heading my={4}>오늘의 상품</Heading>
      <ProductGrid
        productList={productList}
        likes={likes}
        handleLikeClick={handleLikeClick}
        account={account}
      />

      {/*페이지네이션*/}
      <Center>
        <Box mt={"30px"}>
          {pageInfo.currentPageNumber == 0 || (
            <Button
              mr={"10px"}
              onClick={() => handlePageButtonClick(pageInfo.firstPageNumber)}
            >
              <FontAwesomeIcon icon={faAnglesLeft} />
            </Button>
          )}
          {pageInfo.leftPageNumber > 10 && (
            <Button
              mr={"10px"}
              onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </Button>
          )}

          {pageNumbers.map((pageNumber) => (
            <Button
              mr={"10px"}
              onClick={() => handlePageButtonClick(pageNumber)}
              key={pageNumber}
              colorScheme={
                pageNumber - 1 == pageInfo.currentPageNumber ? "teal" : "gray"
              }
            >
              {pageNumber}
            </Button>
          ))}

          {pageInfo.nextPageNumber < pageInfo.lastPageNumber && (
            <Button
              mr={"10px"}
              onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </Button>
          )}
          {pageInfo.currentPageNumber === pageInfo.lastPageNumber - 1 || (
            <Button
              onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </Button>
          )}
        </Box>
      </Center>
    </Box>
  );
}
