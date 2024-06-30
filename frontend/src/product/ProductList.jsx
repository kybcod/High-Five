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
import { ProductGrid } from "./main/ProductGrid.jsx";
import { CategorySwitchCase } from "../component/category/CategorySwitchCase.jsx";
import { SortButton } from "../myPage/customButton/SortButton.jsx";

export function ProductList() {
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [likes, setLikes] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const account = useContext(LoginContext);
  const [keywordCount, setKeywordCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [sortOption, setSortOption] = useState("0");
  const [allTotalCount, setAllTotalCount] = useState(0);
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
        setSortOption(sort.toString());
        setAllTotalCount(res.data.allTotalCount);
      });
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" }); // 페이지가 변경될 때 맨 위로 스크롤
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
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <Flex justifyContent={"center"} align={"center"}>
        {searchParams.get("category") && (
          <Heading>{translatedCategoryName}</Heading>
        )}
        {searchParams.size === 0 && <Heading>전체</Heading>}
      </Flex>
      <Flex mb={10} justifyContent={"space-between"} align={"center"}>
        <Box>
          {searchParams.get("category") && (
            <Text fontSize={"medium"} fontWeight={"bold"}>
              {" "}
              총 {categoryCount} 건
            </Text>
          )}
          {searchParams.size === 0 && (
            <Text fontSize={"medium"} fontWeight={"bold"}>
              {" "}
              총 {allTotalCount} 건
            </Text>
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
              건의 검색 결과입니다.
            </Text>
          )}
        </Box>

        <SortButton
          sortOption={sortOption}
          handleSortChange={handleSortChange}
        />
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
                variant={"outline"}
                borderWidth={3}
                colorScheme={
                  pageNumber - 1 == pageInfo.currentPageNumber ? "teal" : "gray"
                }
              >
                {pageNumber}
              </Button>
            ))}

            {pageInfo.nextPageNumber < pageInfo.lastPageNumber - 1 && (
              <Button
                mr={"10px"}
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
            )}
            {pageInfo.currentPageNumber === pageInfo.lastPageNumber - 1 || (
              <Button
                onClick={() =>
                  handlePageButtonClick(pageInfo.lastPageNumber - 1)
                }
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
