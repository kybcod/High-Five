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
  Stack,
  Text,
} from "@chakra-ui/react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import LoadMoreAndFoldButton from "../component/LoadMoreAndFoldButton.jsx";

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
        console.log(res.data);
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
          console.log(initLike);
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
      <Flex justifyContent={"flex-end"} mb={4}>
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

      {bidList.length === 0 ? (
        <Text align="center" fontSize="xl" fontWeight="bold" mt={4}>
          경매에 참여한 상품이 없습니다.
        </Text>
      ) : (
        <Grid templateColumns={"repeat(3, 1fr)"} gap={6}>
          {bidList.map((bid) => (
            <GridItem key={bid.id}>
              <Card
                cursor={"pointer"}
                maxW="sm"
                h="100%"
                borderRadius="0"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              >
                <CardBody position="relative" h="100%">
                  <Box mt={2} w="100%">
                    <Badge
                      key={bid.product.id}
                      position="absolute"
                      top="1"
                      left="1"
                      colorScheme={bid.bidStatus ? "blue" : "red"}
                    >
                      <Text fontWeight={"bold"}>
                        {bid.bidStatus ? "낙찰 성공" : "낙찰 실패"}
                      </Text>
                    </Badge>

                    {bid.product.status ? (
                      <>
                        {bid.product.productFileList && (
                          <Image
                            onClick={() =>
                              navigate(`/product/${bid.product.id}`)
                            }
                            src={bid.product.productFileList[0].filePath}
                            borderRadius="lg"
                            w="100%"
                            h="200px" // 이미지 높이 조정
                            objectFit="cover" // 이미지가 카드 안에 꽉 차도록 설정
                          />
                        )}

                        <Badge
                          position="absolute"
                          top="1"
                          left="1"
                          colorScheme="teal"
                        >
                          {bid.product.endTimeFormat}
                        </Badge>
                      </>
                    ) : (
                      <Box position={"relative"} w={"100%"} h={"200px"}>
                        <Image
                          src={bid.product.productFileList[0].filePath}
                          borderRadius="lg"
                          w="100%"
                          h="200px" // 이미지 높이 조정
                          objectFit="cover" // 이미지가 카드 안에 꽉 차도록 설정
                          filter="brightness(50%)"
                          position="absolute"
                          top="0"
                          left="0"
                        />
                        <Text
                          onClick={() => navigate(`/product/${bid.product.id}`)}
                          cursor={"pointer"}
                          borderRadius="lg"
                          w="100%"
                          h="200px"
                          position="absolute"
                          top="0"
                          left="0"
                          color={"white"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          fontSize={"2xl"}
                          as="b"
                        >
                          판매완료
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Stack mt="6" spacing="3" flex="1">
                    <Flex justifyContent={"space-between"}>
                      <Text as={"b"} noOfLines={1} fontSize="lg">
                        {bid.product.title}
                      </Text>

                      <Box onClick={() => handleLikeClick(bid.product.id)}>
                        {likes[bid.product.id] ? (
                          <FontAwesomeIcon
                            icon={fullHeart}
                            style={{ color: "red" }}
                            cursor="pointer"
                            size="xl"
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={emptyHeart}
                            style={{ color: "red" }}
                            cursor="pointer"
                            size="xl"
                          />
                        )}
                      </Box>
                    </Flex>
                    <Flex justifyContent={"space-between"}>
                      <Text color="blue.600" fontSize="lg">
                        {bid.product.startPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        원
                      </Text>
                      <Text>{bid.product.timeFormat}</Text>
                    </Flex>
                  </Stack>
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
                          onClick={() => {
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
                          onClick={() => {
                            navigate(
                              `/chat/product/${bid.product.id}/buyer/${bid.userId}`,
                            );
                          }}
                        >
                          거래하기
                        </Button>
                      </Box>
                    )}
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}
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
