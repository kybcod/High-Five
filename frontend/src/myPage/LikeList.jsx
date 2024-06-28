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
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  faCircleCheck,
  faHeart as fullHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadMoreAndFoldButton from "../component/LoadMoreAndFoldButton.jsx";
import { SortButton } from "../component/SortButton.jsx";

export function LikeList() {
  const { userId } = useParams();
  const [likeProductList, setLikeProductList] = useState([]);
  const [likes, setLikes] = useState({});
  const [pageInfo, setPageInfo] = useState({});
  const [sortOption, setSortOption] = useState("0");
  const [hasNextPage, setHasNextPage] = useState(true);
  const [reviewList, setReviewList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("likePage") || "1");
    const likeSort = parseInt(searchParams.get("likeSort") || "0");
    axios
      .get(
        `/api/products/user/${userId}/like?likePage=${currentPage}&likeSort=${likeSort}`,
      )
      .then((res) => {
        console.log(res.data);
        if (currentPage === 1) {
          setLikeProductList(res.data.likeProductList);
        } else {
          setLikeProductList((prevList) => [
            ...prevList,
            ...res.data.likeProductList,
          ]);
        }
        // 좋아요 상태 업데이트
        setLikes((prevLikes) => {
          const updatedLikes = { ...prevLikes };
          res.data.likeProductList.forEach((product) => {
            if (prevLikes[product.id] !== undefined) {
              updatedLikes[product.id] = prevLikes[product.id];
            } else {
              updatedLikes[product.id] = true; // 기본값은 true로 설정
            }
          });
          return updatedLikes;
        });
        setPageInfo(res.data.pageInfo);
        setHasNextPage(res.data.hasNextPage);
        setSortOption(likeSort.toString());
      });
  }, [searchParams]);

  // 새로고침, 다른 페이지 이동 후 다시 돌아왔을 때 페이지1, 최신순으로 재렌더링

  useEffect(() => {
    const currentPage = parseInt(searchParams.get("likePage") || "1");
    const likeSort = parseInt(searchParams.get("likeSort") || "0");
    if (currentPage > 1 || likeSort > 0) {
      searchParams.set("likePage", "1");
      searchParams.set("likeSort", "0");
      setSearchParams(searchParams);
    }
  }, []);

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

  function handleMoreClick() {
    if (!hasNextPage) return;

    const currentPage = parseInt(searchParams.get("likePage") || "1");
    searchParams.set("likePage", currentPage + 1);
    setSearchParams(searchParams);
  }

  function handleFoldClick() {
    const scrollDuration = 500;
    setTimeout(() => {
      searchParams.set("likePage", 1);
      setSearchParams(searchParams);
    }, scrollDuration);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleGetReviewButtonClick = (productId) => {
    // TODO : 후기 조회 버튼 status 추가 예정
    axios
      .get(`/api/reviews/${productId}`)
      .then((res) => {
        if (res.data != null) {
          setReviewList(res.data);
        }
      })
      .catch()
      .finally();
  };

  function handleSortChange(sortValue) {
    setSortOption(sortValue);
    searchParams.set("likeSort", sortValue);
    setSearchParams(searchParams);
  }

  return (
    <Box>
      <SortButton sortOption={sortOption} handleSortChange={handleSortChange} />

      {likeProductList.length === 0 ? (
        <Text align="center" fontSize="xl" fontWeight="bold" mt={4}>
          찜한 상품이 없습니다.
        </Text>
      ) : (
        <Grid templateColumns={"repeat(3, 1fr)"} gap={6}>
          {likeProductList.map((product) => (
            <GridItem key={product.id}>
              <Card
                boxShadow={"none"}
                borderColor={"gray.200"}
                borderWidth={"1px"}
                cursor={"pointer"}
                maxW="sm"
                h="100%"
                borderBottomRadius={"0"}
                overflow="hidden"
              >
                <CardBody position="relative" h="100%" p={0}>
                  <Box position={"relative"}>
                    {product.status ? (
                      <>
                        {product.productFileList && (
                          <Image
                            onClick={() => navigate(`/product/${product.id}`)}
                            src={product.productFileList[0].filePath}
                            w="100%"
                            h="200px"
                            transition="transform 0.2s"
                            _hover={{ transform: "scale(1.02)" }}
                          />
                        )}

                        {account.isLoggedIn() && (
                          <Box
                            position="absolute"
                            bottom={2}
                            right={2}
                            onClick={() => handleLikeClick(product.id)}
                          >
                            <FontAwesomeIcon
                              icon={likes[product.id] ? fullHeart : emptyHeart}
                              style={{ color: "red" }}
                              size="lg"
                            />
                          </Box>
                        )}
                      </>
                    ) : (
                      <Box
                        transition="transform 0.2s"
                        _hover={{ transform: "scale(1.02)" }}
                        position={"relative"}
                      >
                        <Image
                          src={product.productFileList[0].filePath}
                          w="100%"
                          h="200px"
                          filter="brightness(50%)"
                          position="absolute"
                          top="0"
                          left="0"
                        />
                        <Text
                          onClick={() => navigate(`/product/${product.id}`)}
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
                  <Box p={3}>
                    <Text
                      mb={2}
                      fontWeight={"bold"}
                      noOfLines={1}
                      fontSize="lg"
                    >
                      {product.title}
                    </Text>
                    <Text color="blue.600" fontSize="lg">
                      {product.startPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      원
                    </Text>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Text mt={2} fontSize={"sm"}>
                        {product.timeFormat}
                      </Text>
                      {product.status && (
                        <Badge colorScheme="yellow">
                          {product.endTimeFormat}
                        </Badge>
                      )}
                    </Flex>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}

      {/*더보기 접기 버튼*/}
      {likeProductList.length > 0 && (
        <Box display={"flex"} justifyContent={"center"}>
          <LoadMoreAndFoldButton
            hasNextPage={hasNextPage}
            productListLength={likeProductList.length}
            onMoreClick={handleMoreClick}
            onFoldClick={handleFoldClick}
          />
        </Box>
      )}
      {/* 후기 작성 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>판매자님에게 보내는 후기</ModalHeader>
          <ModalBody>
            <List>
              {reviewList.map((review) => (
                <ListItem key={review.id}>
                  <FontAwesomeIcon icon={faCircleCheck} />
                  &nbsp;
                  {review.content}
                </ListItem>
              ))}
            </List>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Box>
  );
}
