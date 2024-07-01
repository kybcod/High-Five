import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  List,
  ListIcon,
  ListItem,
  Spacer,
  Spinner,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCheckCircle,
  faCommentDots,
  faEye,
  faHandHoldingUsd,
  faHeart as fullHeart,
  faTrashAlt,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimpleSlider from "../component/slider/SimpleSlider.jsx";
import {
  faHeart as emptyHeart,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";
import ReportButton from "../user/ReportButton.jsx";
import AuctionModal from "./AuctionModal.jsx";
import { ModalComponent } from "../component/ModalComponent.jsx";

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [existingFilePreviews, setExistingFilePreviews] = useState([]);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [bidPrice, setBidPrice] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const account = useContext(LoginContext);
  const deleteModal = useDisclosure();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure({
    onClose: () => setBidPrice(""),
  });
  const { errorToast, successToast } = CustomToast();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setExistingFilePreviews(res.data.productFileList || []);
      setLike(res.data.like);
    });
  }, [isProcessing]);

  function handleLikeClick() {
    axios.put("/api/products/like", { productId: product.id }).then((res) => {
      setLike(res.data);
    });
  }

  function handleJoinClick() {
    if (parseInt(bidPrice) >= product.startPrice) {
      setIsProcessing(true);
      axios
        .post("/api/bids", {
          productId: id,
          userId: account.id,
          bidPrice: bidPrice,
        })
        .then(() => {
          successToast("경매 참여 성공하였습니다.");
        })
        .catch(() => {
          errorToast("경매 참여 실패하였습니다.");
        })
        .finally(() => {
          onClose();
          setIsProcessing(false);
        });
    } else {
      errorToast("입찰 금액이 시작 가격보다 작습니다.");
    }
  }

  const formattedPrice = (money) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function handleIntegerNumber(e) {
    const formattedValue = e.target.value.replaceAll(",", "");
    if (!isNaN(formattedValue)) {
      setBidPrice(formattedValue);
    }
  }

  function handleLoginRedirect() {
    navigate("/login");
  }

  if (product === null) {
    return <Spinner />;
  }

  // 채팅방 연결
  const handleEnterChatRoom = () => {
    if (account.isLoggedIn()) {
      navigate(`/chat/product/${product.id}/buyer/${account.id}`);
    } else {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  };

  function handleDeleteClick() {
    setDeleteLoading(true);
    axios
      .delete(`/api/products/${id}`)
      .then(() =>
        toast({
          status: "info",
          description: "해당 상품이 삭제되었습니다.",
          position: "top-right",
          duration: 1000,
        }),
      )
      .catch((err) => {
        toast({
          status: "warning",
          description: "삭제되지 않았습니다. 다시 확인해주세요.",
          position: "top-right",
          duration: 1000,
        });
      })
      .finally(() => {
        deleteModal.onClose();
        setDeleteLoading(false);
        navigate("/");
      });
  }

  return (
    <Box>
      <Flex alignItems="flex-start">
        <Box width="45%" mr={20}>
          <SimpleSlider
            images={existingFilePreviews}
            isBrightness={!product.status}
          />
        </Box>

        <Box flex="1">
          <Box mb={6}>
            <Heading>{product.title}</Heading>
          </Box>
          <Flex mb={5} justifyContent="space-between">
            <Text>
              <Text fontSize="2xl" as="span" fontWeight={"500"} mr={1}>
                {formattedPrice(product.startPrice)} 원
              </Text>
              (시작가)
            </Text>
            <Text fontSize="2xl">
              {product.status || (
                <>
                  {product.maxBidPrice !== null ? (
                    <Box mb={5}>
                      <Box
                        style={{ whiteSpace: "nowrap" }}
                        fontWeight="bold"
                        color="red"
                      >
                        낙찰 금액 : {formattedPrice(product.maxBidPrice)}원
                      </Box>
                    </Box>
                  ) : (
                    <Box mb={5}>
                      <Box
                        style={{ whiteSpace: "nowrap" }}
                        fontWeight="bold"
                        fontSize="3xl"
                        color="red"
                      >
                        낙찰된 금액이 없습니다.
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Text>
          </Flex>

          <Divider mb={6} />

          {/*다른 user의 상품 일 때*/}
          <Box mb={10}>
            <Flex justifyContent="space-evenly" alignItems="center">
              <Flex alignItems="center" mr={4}>
                <FontAwesomeIcon icon={fullHeart} size="lg" />
                <Text ml={1}>{like.count}</Text>
              </Flex>
              <Box height="24px" borderLeft="1px solid #ccc" />
              <Flex alignItems="center" ml={4} mr={4}>
                <FontAwesomeIcon icon={faEye} size="lg" />
                <Box ml={2}>{product.viewCount}</Box>
              </Flex>
              <Box height="24px" borderLeft="1px solid #ccc" />
              <Box>
                <Text fontSize="lg" ml={4}>
                  {product.timeFormat}
                </Text>
              </Box>
              <Spacer />
              {account.isLoggedIn() && !account.hasAccess(product.userId) && (
                <Flex>
                  <ReportButton userId={product.userId} />
                </Flex>
              )}
              {account.isAdmin() && (
                <Tooltip label="해당 상품 삭제">
                  <Button
                    colorScheme={"red"}
                    ml={2}
                    onClick={deleteModal.onOpen}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                </Tooltip>
              )}
            </Flex>
          </Box>

          <List spacing={3} fontSize="lg">
            <ListItem display="flex" alignItems="center" mb={9}>
              <ListIcon
                as={() => (
                  <FontAwesomeIcon icon={faCheckCircle} color="#adb5bd" />
                )}
              />
              <Box ml={4} display="flex" alignItems="center">
                <Text fontSize={"medium"} mr={4} w={"100px"}>
                  판매자
                </Text>
                <Tooltip label="판매자 페이지로 이동">
                  <Text
                    textDecoration="underline"
                    fontSize="medium"
                    cursor="pointer"
                    onClick={() => navigate(`/myPage/${product.userId}/shop`)}
                    ml={1}
                    fontWeight={"500"}
                  >
                    {product.userNickName}
                  </Text>
                </Tooltip>
              </Box>
            </ListItem>
            <ListItem display="flex" alignItems="center" mb={9}>
              <ListIcon
                as={() => (
                  <FontAwesomeIcon icon={faCheckCircle} color="#adb5bd" />
                )}
              />
              <Box ml={4} display="flex" alignItems="center">
                <Text fontSize={"medium"} w={"100px"} mr={4}>
                  종료 시간
                </Text>
                <Text fontSize="medium" ml={1} fontWeight={"500"}>
                  {product.endTimeDetailsFormat}
                </Text>
              </Box>
            </ListItem>
            <ListItem display="flex" alignItems="center" mb={9}>
              <ListIcon
                as={() => (
                  <FontAwesomeIcon icon={faCheckCircle} color="#adb5bd" />
                )}
              />
              <Box ml={4} display="flex" alignItems="center">
                <Text fontSize={"medium"} w={"100px"} mr={4}>
                  참여 인원
                </Text>
                <Text fontSize="medium" ml={1} fontWeight={"500"}>
                  {product.numberOfJoin}명
                </Text>
              </Box>
            </ListItem>
          </List>

          {/*판매 완료, 로그인이 안되어 있는 상태, 자신의 상품일 때 보이지 않음*/}
          {account.hasAccess(product.userId) || (
            <Box mb={5}>
              <Flex
                w={"100%"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Box w={"100%"} mr={4}>
                  <Button
                    w={"100%"}
                    h={"60px"}
                    fontSize={"lg"}
                    onClick={
                      account.isLoggedIn()
                        ? handleLikeClick
                        : handleLoginRedirect
                    }
                    leftIcon={
                      <FontAwesomeIcon
                        icon={like.like ? fullHeart : emptyHeart}
                        size="lg"
                        color={like.like ? "white" : "red"}
                      />
                    }
                    colorScheme={like.like ? "red" : "gray"}
                    color={like.like ? "white" : "black"}
                  >
                    <Text fontSize={"lg"}>{like.count}</Text>
                  </Button>
                </Box>

                {!product.status || account.hasAccess(product.userId) || (
                  <Box w={"100%"} mr={4}>
                    <Button
                      h={"60px"}
                      colorScheme="orange"
                      w="100%"
                      onClick={
                        account.isLoggedIn() ? onOpen : handleLoginRedirect
                      }
                      fontSize={"lg"}
                      leftIcon={<FontAwesomeIcon icon={faHandHoldingUsd} />}
                    >
                      참여하기
                    </Button>
                  </Box>
                )}

                {account.hasAccess(product.userId) || (
                  <Box w={"100%"}>
                    <Button
                      colorScheme="teal"
                      w="100%"
                      h={"60px"}
                      leftIcon={<FontAwesomeIcon icon={faCommentDots} />}
                      onClick={
                        account.isLoggedIn()
                          ? handleEnterChatRoom
                          : handleLoginRedirect
                      }
                      fontSize={"lg"}
                    >
                      문의하기
                    </Button>
                  </Box>
                )}
              </Flex>
            </Box>
          )}

          {account.hasAccess(product.userId) && (
            <Box mb={5}>
              <Button
                borderWidth={3}
                variant={"outline"}
                colorScheme={"teal"}
                w="100%"
                h={"60px"}
                fontSize={"lg"}
                onClick={() => navigate(`/edit/${product.id}`)}
              >
                상품수정
              </Button>
            </Box>
          )}
        </Box>
      </Flex>

      <Divider my={10} />

      <Box>
        <FormControl>
          <FormLabel mb={10}>
            <Heading fontSize="2xl">상품 정보</Heading>
          </FormLabel>
          {product.content !== null && product.content !== "" ? (
            <Textarea
              borderWidth={0}
              height={"300px"}
              readOnly
              resize={"none"}
              defaultValue={product.content}
              whiteSpace="pre-wrap"
            />
          ) : (
            <Text>상품 설명이 없습니다.</Text>
          )}
        </FormControl>
      </Box>

      {/*모달 참여하기 */}
      <AuctionModal
        isOpen={isOpen}
        onClose={onClose}
        formattedPrice={formattedPrice}
        handleJoinClick={handleJoinClick}
        handleIntegerNumber={handleIntegerNumber}
        bidPrice={bidPrice}
        isProcessing={isProcessing}
        product={product}
      />

      {/* 삭제 모달 */}
      <ModalComponent
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        onClick={handleDeleteClick}
        isLoading={deleteLoading}
        loadingText="처리중"
        header="삭제"
        body="정말로 삭제하시겠습니까?"
        confirmText="확인"
        colorScheme="red"
        icon={faTrashAlt}
        headerIcon={faTriangleExclamation}
        cancelText="취소"
      />
    </Box>
  );
}
