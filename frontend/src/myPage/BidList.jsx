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
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrowDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { LoginContext } from "../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

export function BidList() {
  const { userId } = useParams();
  const [bidList, setBidList] = useState(null);
  const [pageInfo, setPageInfo] = useState({});
  const [hasNextPage, setHasNextPage] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [likes, setLikes] = useState({});
  const { account } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("page") || "1");

    axios.get(`/api/bids/${userId}/list?page=${currentPage}`).then((res) => {
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

  if (bidList === null) {
    return <Spinner />;
  }

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

    const currentPage = parseInt(searchParams.get("page") || "1");
    searchParams.set("page", currentPage + 1);
    setSearchParams(searchParams);
  }

  function handleFoldClick() {
    const scrollDuration = 500;
    setTimeout(() => {
      searchParams.set("page", 1);
      setSearchParams(searchParams);
    }, scrollDuration);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Box>
      {bidList.length === 0 ? (
        <Text align="center" fontSize="xl" fontWeight="bold" mt={4}>
          경매에 참여한 상품이 없습니다.
        </Text>
      ) : (
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={6}
        >
          {bidList.map((bid) => (
            <GridItem key={bid.id}>
              <Card
                cursor={"pointer"}
                maxW="sm"
                h="100%"
                borderWidth="1px"
                borderColor={"#eee"}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
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
                            h="200px"
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
                          h="200px"
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
                  <Stack mt="6" spacing="3">
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
                  {/*{!bid.product.status && bid.bidStatus && (*/}
                  {/*    <Box display="flex" justifyContent="center">*/}
                  {/*      <Button*/}
                  {/*          mt={2}*/}
                  {/*          w={"100%"}*/}
                  {/*          colorScheme={"purple"}*/}
                  {/*          onClick={() => {*/}
                  {/*            navigate(*/}
                  {/*                `/chat/product/${bid.product.id}/buyer/${bid.userId}`,*/}
                  {/*            );*/}
                  {/*          }}*/}
                  {/*      >*/}
                  {/*        {bid.product.paymentStatus ? "결제완료" : "거래하기"}*/}
                  {/*      </Button>*/}
                  {/*    </Box>*/}
                  {/*)}*/}
                  {!bid.product.status &&
                    bid.bidStatus &&
                    bid.product.paymentStatus && (
                      <Box display="flex" justifyContent="center">
                        <Button
                          mt={2}
                          w={"100%"}
                          borderColor={"gray"}
                          borderWidth={"2px"}
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
                          borderColor={"purple"}
                          borderWidth={"2px"}
                          colorScheme={"whiteAlpha"}
                          color={"purple"}
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
          {hasNextPage ? (
            <Button
              w={"30%"}
              colorScheme={"black"}
              variant={"outline"}
              borderRadius={"0px"}
              mt={4}
              onClick={handleMoreClick}
              rightIcon={<ArrowDownIcon />}
            >
              더보기
            </Button>
          ) : (
            bidList.length > 9 && (
              <Button
                w={"30%"}
                colorScheme={"black"}
                variant={"outline"}
                borderRadius={"0px"}
                mt={4}
                rightIcon={<ChevronUpIcon />}
                onClick={handleFoldClick}
              >
                접기
              </Button>
            )
          )}
        </Box>
      )}
    </Box>
  );
}
