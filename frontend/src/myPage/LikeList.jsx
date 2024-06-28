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
  Stack,
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
                borderStyle={"solid"}
                borderColor={"black.300"}
                borderWidth={"1px"}
                cursor={"pointer"}
                maxW="sm"
                h="100%"
                borderRadius="0"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              >
                <CardBody position="relative" h="100%">
                  <Box mt={2} w="100%">
                    {product.status ? (
                      <>
                        {product.productFileList && (
                          <Image
                            onClick={() => navigate(`/product/${product.id}`)}
                            src={product.productFileList[0].filePath}
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
                          {product.endTimeFormat}
                        </Badge>
                      </>
                    ) : (
                      <Box position={"relative"} w={"100%"} h={"200px"}>
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
                  <Stack mt="6" spacing="3">
                    <Flex justifyContent={"space-between"}>
                      <Text as={"b"} noOfLines={1} fontSize="lg">
                        {product.title}
                      </Text>

                      {account.isLoggedIn() && (
                        <Box onClick={() => handleLikeClick(product.id)}>
                          {(() => {
                            const isLiked = likes[product.id];
                            const icon = isLiked ? fullHeart : emptyHeart;
                            return (
                              <FontAwesomeIcon
                                icon={icon}
                                style={{ color: "red" }}
                                cursor="pointer"
                                size="xl"
                              />
                            );
                          })()}
                        </Box>
                      )}
                    </Flex>
                    <Flex justifyContent={"space-between"}>
                      <Text color="blue.600" fontSize="lg">
                        {product.startPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        원
                      </Text>
                      <Text>{product.timeFormat}</Text>
                    </Flex>
                  </Stack>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}
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
