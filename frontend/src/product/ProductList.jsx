import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { ProductGrid } from "./ProductGrid.jsx";
import { CategorySwitchCase } from "../component/CategorySwitchCase.jsx";

export function ProductList() {
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [likes, setLikes] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const account = useContext(LoginContext);
  const [keywordCount, setKeywordCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [sortOption, setSortOption] = useState("0");
  const category = searchParams.get("category") || "";
  const translatedCategoryName = CategorySwitchCase({ categoryName: category });

  useEffect(() => {
    const sort = parseInt(searchParams.get("sort") || "0");

    axios
      .get(`/api/products/search?${searchParams}&sort=${sort}`)
      .then((res) => {
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
        setKeywordCount(res.data.keywordCount);
        setCategoryCount(res.data.categoryCount);
      });
  }, [searchParams]);

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

  function handleSortChange(sortValue) {
    setSortOption(sortValue);
    searchParams.set("sort", sortValue);
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <Flex mb={10} justifyContent={"space-between"} align={"center"}>
        <Box>
          {searchParams.get("category") && (
            <Heading>
              {translatedCategoryName} {categoryCount} 개
            </Heading>
          )}
          {searchParams.get("title") && productList.length !== 0 && (
            <Text>
              <Text as="span" fontWeight={"bold"}>
                "{searchParams.get("title")}"
              </Text>{" "}
              에 대한{" "}
              <Text as="span" color="green" fontWeight={"bold"}>
                {keywordCount}
              </Text>{" "}
              개의 검색 결과입니다.
            </Text>
          )}
        </Box>

        <Flex>
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
      </Flex>
      <ProductGrid
        productList={productList}
        likes={likes}
        handleLikeClick={handleLikeClick}
        account={account}
      />

      {/*페이지네이션*/}
      <Center>
        {productList.length === 0 ? (
          <Text>해당 상품의 검색 결과가 없습니다.</Text>
        ) : (
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
        )}
      </Center>
    </Box>
  );
}
