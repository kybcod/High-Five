import {
  Box,
  Button,
  Center,
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
import { faEye, faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimpleSlider from "./SimpleSlider.jsx";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Category } from "../component/Category.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";

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
        .post("/api/products/join", {
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

  function translateCategory(category) {
    switch (category) {
      case "clothes":
        return "의류";
      case "goods":
        return "잡화";
      case "food":
        return "식품";
      case "digital":
        return "디지털";
      case "sport":
        return "스포츠";
      case "e-coupon":
        return "e-쿠폰";
      default:
        return "";
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
      navigate(`/chat/${product.id}`);
    } else {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  };

  return (
    <Box>
      <Category />
      {/*TODO:user 상점 조회 고미*/}
      <Box mt={3}>
        <Heading
          color={"blue"}
          cursor={"pointer"}
          onClick={() => navigate(`/shop/${product.userId}`)}
        >
          {product.userNickName}
        </Heading>
        <Flex justifyContent={"space-evenly"}>
          <SimpleSlider
            images={existingFilePreviews}
            isBrightness={!product.status}
          />
          <Box ml={10} mb={5}>
            <Box mb={5}>
              <Heading fontSize={"xl"}> {product.title} </Heading>
            </Box>
            <Flex mb={5} justifyContent={"space-between"}>
              <Box>
                <Text fontSize={"xl"}>
                  {formattedPrice(product.startPrice)}원
                </Text>
              </Box>
              <Box>
                <Text fontSize={"xl"}>
                  {translateCategory(product.category)}
                </Text>
              </Box>
            </Flex>
            <Divider orientation="horizontal" mb={2} />
            <Flex mb={5} justifyContent={"space-between"}>
              <Flex>
                <Center>
                  <Box mr={1}>찜</Box>
                  {account.isLoggedIn() && (
                    <Box onClick={handleLikeClick}>
                      {like.like && (
                        <FontAwesomeIcon
                          icon={fullHeart}
                          size={"lg"}
                          color={"red"}
                          cursor={"pointer"}
                        />
                      )}
                      {like.like || (
                        <FontAwesomeIcon
                          icon={emptyHeart}
                          size={"lg"}
                          color={"red"}
                          cursor={"pointer"}
                        />
                      )}
                    </Box>
                  )}
                  <Box>{like.count}</Box>
                </Center>
              </Flex>
              <Flex mb={2}>
                <Center>
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faEye} />
                  </Box>
                  <Box>{product.viewCount}</Box>
                </Center>
              </Flex>
              <Button onClick={handleEnterChatRoom}>문의하기</Button>
              <Button>신고하기</Button>
            </Flex>
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

      <Divider mb={2} />

      <Box>
        <FormControl>
          <FormLabel>
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
          <ModalHeader></ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>입찰 금액</FormLabel>
              <InputGroup>
                <Input
                  value={formattedPrice(bidPrice)}
                  onChange={(e) => handleIntegerNumber(e)}
                />

                <InputRightAddon>원</InputRightAddon>
              </InputGroup>
              <Box>
                {parseInt(bidPrice) <= product.startPrice && (
                  <FormHelperText color={"red"}>
                    입찰 금액이 시작가보다 작습니다.
                  </FormHelperText>
                )}
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button isProcessing={isProcessing} onClick={handleJoinClick}>
              확인
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
