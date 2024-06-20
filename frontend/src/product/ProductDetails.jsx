import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCommentDots,
  faEye,
  faHeart as fullHeart,
  faMoneyBillAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimpleSlider from "./slider/SimpleSlider.jsx";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Category } from "../component/Category.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";
import ReportButton from "../user/ReportButton.jsx";

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [existingFilePreviews, setExistingFilePreviews] = useState([]);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [bidPrice, setBidPrice] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure({
    onClose: () => setBidPrice(""),
  });
  const { errorToast, successToast } = CustomToast();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => {
      console.log(res.data);
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
    if (parseInt(bidPrice) > product.startPrice) {
      setIsProcessing(true);
      axios
        .post("/api/bids/join", {
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

  return (
    <Box>
      <Category />
      <Box mt={3}>
        <Heading
          mb={3}
          color={"blue"}
          cursor={"pointer"}
          onClick={() => navigate(`/myPage/${product.userId}/shop`)}
        >
          {product.userNickName}
        </Heading>
        <Flex justifyContent={"space-around"}>
          <SimpleSlider
            images={existingFilePreviews}
            isBrightness={!product.status}
          />

          <Box ml={10} mb={5}>
            {product.status || (
              <>
                {product.maxBidPrice !== null ? (
                  <Box
                    mb={5}
                    display={"flex"}
                    alignContent={"center"}
                    justifyContent={"center"}
                  >
                    <Box fontWeight={"bold"} fontSize={"3xl"} color={"red"}>
                      낙찰 금액 : {formattedPrice(product.maxBidPrice)}원
                    </Box>
                  </Box>
                ) : (
                  <Box
                    mb={5}
                    display={"flex"}
                    alignContent={"center"}
                    justifyContent={"center"}
                  >
                    <Box fontWeight={"bold"} fontSize={"3xl"} color={"red"}>
                      낙찰된 금액이 없습니다.
                    </Box>
                  </Box>
                )}
              </>
            )}
            <Box mb={5}>
              <Heading> {product.title} </Heading>
            </Box>
            <Flex mb={5} justifyContent={"space-between"}>
              <Box>
                <Text fontSize={"xl"}>
                  {formattedPrice(product.startPrice)}원
                </Text>
              </Box>
              <Box>
                <Text fontSize={"xl"}>{product.timeFormat}</Text>
              </Box>
            </Flex>

            <Divider mb={2} />

            {/*로그인이 되어 있고 내 상품 아닐 때*/}
            {account.isLoggedIn() && !account.hasAccess(product.userId) && (
              <Flex
                mb={5}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Flex alignItems={"center"} mr={4}>
                  <Box mr={2}>찜</Box>
                  {account.isLoggedIn() && (
                    <Button
                      onClick={handleLikeClick}
                      leftIcon={
                        <FontAwesomeIcon
                          icon={like.like ? fullHeart : emptyHeart}
                          size={"lg"}
                        />
                      }
                      colorScheme={like.like ? "red" : "gray"}
                      variant="outline"
                    >
                      {like.count}
                    </Button>
                  )}
                </Flex>
                <Flex alignItems={"center"} mr={4}>
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faEye} size={"lg"} />
                  </Box>
                  <Box>{product.viewCount}</Box>
                </Flex>
                <Flex>
                  <Box>
                    <Button
                      colorScheme="teal"
                      leftIcon={<FontAwesomeIcon icon={faCommentDots} />}
                      onClick={handleEnterChatRoom}
                      mr={4}
                    >
                      문의하기
                    </Button>
                  </Box>
                  <Box>
                    <ReportButton userId={product.userId} />
                  </Box>
                </Flex>
              </Flex>
            )}

            {/*로그인이 되어 있지 않거나 내 상품일 때*/}
            {(!account.isLoggedIn() || account.hasAccess(product.userId)) && (
              <Flex mb={5} alignItems={"center"} justifyContent={"center"}>
                <Flex alignItems={"center"} mr={10}>
                  <Box mr={3}>찜</Box>
                  {like.count}
                </Flex>
                <Flex alignItems={"center"} mr={4}>
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faEye} size={"lg"} />
                  </Box>
                  <Box>{product.viewCount}</Box>
                </Flex>
              </Flex>
            )}

            <Box
              mb={5}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Heading fontSize={"2xl"}>
                {product.endTimeDetailsFormat}{" "}
              </Heading>
            </Box>
            <Box
              mb={5}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Heading color={"skyblue"}>
                현재 참여 인원 {product.numberOfJoin}명
              </Heading>
            </Box>
            {product.status && (
              <Box mb={5}>
                {!account.isLoggedIn() || account.hasAccess(product.userId) || (
                  <Box>
                    <Button colorScheme={"green"} w={"100%"} onClick={onOpen}>
                      참여하기
                    </Button>
                  </Box>
                )}
                {account.hasAccess(product.userId) && (
                  <Box>
                    <Button
                      colorScheme={"green"}
                      w={"100%"}
                      onClick={() => navigate(`/edit/${product.id}`)}
                    >
                      상품수정
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Flex>
      </Box>

      <Divider mb={5} />

      <Box>
        <FormControl>
          <FormLabel mb={5}>
            <Heading fontSize={"2xl"}>상품 정보</Heading>
          </FormLabel>
          {product.content !== null && product.content !== "" ? (
            <Textarea defaultValue={product.content} whiteSpace={"pre-wrap"} />
          ) : (
            <Text>상품 설명이 없습니다.</Text>
          )}
        </FormControl>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Box mr={2}>
                <FontAwesomeIcon icon={faMoneyBillAlt} size="lg" />
              </Box>
              <Heading fontSize="xl">경매 참여하기</Heading>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>입찰 금액</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  value={formattedPrice(bidPrice)}
                  onChange={(e) => handleIntegerNumber(e)}
                  placeholder="숫자만 입력하세요"
                  borderRadius="none"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
                />
                <InputRightAddon>원</InputRightAddon>
              </InputGroup>
              {parseInt(bidPrice) <= product.startPrice && (
                <FormHelperText color={"red"} mt={2}>
                  입찰 금액이 시작가보다 작습니다.
                </FormHelperText>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleJoinClick}
              isLoading={isProcessing}
              loadingText="처리중..."
            >
              확인
            </Button>
            <Button onClick={onClose} ml={3}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
