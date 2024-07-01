import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { LoginContext } from "../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import LoadMoreAndFoldButton from "./customButton/LoadMoreAndFoldButton.jsx";
import { SortButton } from "./customButton/SortButton.jsx";

export function BidList() {
  const { userId } = useParams();
  const [bidList, setBidList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [hasNextPage, setHasNextPage] = useState(true);
  const [sortOption, setSortOption] = useState("0");
  const [searchParams, setSearchParams] = useSearchParams();
  const [likes, setLikes] = useState({});
  const { account } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("bidPage") || "1");
    const bidSort = parseInt(searchParams.get("bidSort") || "0");

    axios
      .get(`/api/bids/${userId}/list?bidPage=${currentPage}&bidSort=${bidSort}`)
      .then((res) => {
        if (currentPage === 1) {
          // 첫 번째 페이지
          setBidList(res.data.bidList);
        } else {
          // 이후 페이지 : 기존 리스트에 추가
          setBidList((prevList) => [...prevList, ...res.data.bidList]);
        }
        setPageInfo(res.data.pageInfo);
        setHasNextPage(res.data.hasNextPage);
        setSortOption(bidSort.toString());

        axios.get(`/api/products/like/${userId}`).then((initLike) => {
          // initLike : 좋아요 상태인 productId들
          const likeData = initLike.data.reduce((acc, productId) => {
            acc[productId] = true;
            return acc;
          }, {});
          setLikes(likeData);
        });
      });
  }, [searchParams]);

  // 새로고침, 다른 페이지 이동 후 다시 돌아왔을 때 페이지1, 최신순으로 재렌더링
  useEffect(() => {
    const currentPage = parseInt(searchParams.get("bidPage") || "1");
    const bidSort = parseInt(searchParams.get("bidSort") || "0");
    if (currentPage > 1 || bidSort > 0) {
      searchParams.set("bidPage", "1");
      searchParams.set("bidSort", "0");
      setSearchParams(searchParams);
    }
  }, []);

  function handleLikeClick(productId) {
    axios
      .put("/api/products/like", { productId })
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

  function handleMoreClick() {
    if (!hasNextPage) return;

    const currentPage = parseInt(searchParams.get("bidPage") || "1");
    searchParams.set("bidPage", currentPage + 1);
    setSearchParams(searchParams);
  }

  function handleFoldClick() {
    const scrollDuration = 500;
    setTimeout(() => {
      searchParams.set("bidPage", 1);
      setSearchParams(searchParams);
    }, scrollDuration);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSortChange(sortValue) {
    setSortOption(sortValue);
    searchParams.set("bidSort", sortValue);
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <SortButton sortOption={sortOption} handleSortChange={handleSortChange} />

      {bidList.length === 0 ? (
        <Text align="center" fontSize="xl" fontWeight="bold" mt={4}>
          경매에 참여한 상품이 없습니다.
        </Text>
      ) : (
        <Grid templateColumns={"repeat(3, 1fr)"} gap={16}>
          {bidList.map((bid) => (
            <GridItem key={bid.id}>
              <Card
                onClick={() => {
                  navigate(`/product/${bid.product.id}`);
                  window.scrollTo({ top: 0, behavior: "auto" });
                }}
                boxShadow={"none"}
                borderColor={"gray.200"}
                borderWidth={"1px"}
                cursor={"pointer"}
                maxW="sm"
                h={"auto"}
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <CardBody position="relative" h="100%" p={0}>
                  <Box position={"relative"}>
                    <Image
                      src={bid.product.productFileList[0].filePath}
                      w="100%"
                      h="250px"
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.02)" }}
                    />

                    {bid.product.status || (
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
                        zIndex={1}
                      >
                        <Text color="white" fontSize="2xl" fontWeight="bold">
                          판매완료
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {/*정보*/}
                  <Box p={3}>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Text
                        mr={2}
                        mb={1}
                        fontWeight={"500"}
                        noOfLines={1}
                        fontSize="lg"
                      >
                        {bid.product.title}
                      </Text>
                      {/*{account.isLoggedIn() && (*/}
                      <Box
                        zIndex={2}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeClick(bid.product.id);
                        }}
                        transition="transform 0.2s"
                        _hover={{ transform: "scale(1.1)" }}
                      >
                        <FontAwesomeIcon
                          icon={likes[bid.product.id] ? fullHeart : emptyHeart}
                          style={{ color: "red" }}
                          size="xl"
                        />
                      </Box>
                      {/*)}*/}
                    </Flex>
                    <Flex mb={1} alignItems={"baseline"}>
                      <Text
                        mr={2}
                        fontSize={
                          bid.product.startPrice.toString().length > 8
                            ? "sm"
                            : bid.product.startPrice.toString().length > 6
                              ? "md"
                              : "lg"
                        }
                        fontWeight="bold"
                      >
                        {bid.product.startPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                        원
                      </Text>
                      <Text color={"gray.500"} fontSize={"sm"}>
                        (시작가)
                      </Text>
                    </Flex>
                    {/*판매 종료가 안되면 endTime 벳지*/}
                    {bid.product.status && (
                      <Badge colorScheme="yellow">
                        {bid.product.endTimeFormat}
                      </Badge>
                    )}

                    {/*판매 종료가 되고 낙찰 성공 유무에 따른 뱃지*/}
                    {bid.product.status || (
                      <Badge
                        key={bid.product.id}
                        colorScheme={bid.bidStatus ? "blue" : "red"}
                      >
                        <Text fontWeight={"bold"}>
                          {bid.bidStatus ? "낙찰 성공" : "낙찰 실패"}
                        </Text>
                      </Badge>
                    )}

                    {/* TODO : 버튼 배치 */}
                    {!bid.product.status &&
                      bid.bidStatus &&
                      bid.product.paymentStatus && (
                        <Box display="flex" justifyContent="center">
                          <Button
                            mt={2}
                            w={"100%"}
                            borderColor={"gray"}
                            borderWidth={3}
                            colorScheme={"whiteAlpha"}
                            color={"gray"}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/chat/product/${bid.product.id}/buyer/${bid.userId}`,
                              );
                            }}
                          >
                            결제완료
                          </Button>
                        </Box>
                      )}
                    {!bid.product.status &&
                      bid.bidStatus &&
                      !bid.product.paymentStatus && (
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
                              navigate(
                                `/chat/product/${bid.product.id}/buyer/${bid.userId}`,
                              );
                            }}
                          >
                            거래하기
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
      {bidList.length > 0 && (
        <Box display={"flex"} justifyContent={"center"}>
          <LoadMoreAndFoldButton
            hasNextPage={hasNextPage}
            productListLength={bidList.length}
            onMoreClick={handleMoreClick}
            onFoldClick={handleFoldClick}
          />
        </Box>
      )}
    </Box>
  );
}
