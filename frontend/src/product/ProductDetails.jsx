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
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Spacer,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
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
  faMoneyBillAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimpleSlider from "./slider/SimpleSlider.jsx";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
      {/*<Category />*/}
      <Divider my={10} borderColor="gray" />

      <Flex alignItems="flex-start">
        <Box width="45%" mr={20}>
          <SimpleSlider
            images={existingFilePreviews}
            isBrightness={!product.status}
          />
        </Box>

        <Box flex="1">
          <Box mb={7}>
            <Heading style={{ whiteSpace: "nowrap" }}>{product.title}</Heading>
          </Box>
          <Flex mb={5} justifyContent="space-between">
            <Text fontSize="2xl">{formattedPrice(product.startPrice)}원</Text>
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
            </Flex>
          </Box>

          <List mb={10} spacing={3} fontSize="lg">
            <ListItem>
              <ListIcon
                as={() => (
                  <FontAwesomeIcon icon={faCheckCircle} color="green" />
                )}
              />{" "}
              판매자 :{" "}
              <Box mb={5} display="inline-block">
                <Text
                  textDecoration="underline"
                  fontSize="xl"
                  cursor="pointer"
                  onClick={() => navigate(`/myPage/${product.userId}/shop`)}
                >
                  {product.userNickName}
                </Text>
              </Box>
            </ListItem>
            <ListItem>
              <ListIcon
                as={() => (
                  <FontAwesomeIcon icon={faCheckCircle} color="green" />
                )}
              />{" "}
              종료 시간 :{" "}
              <Box mb={5} display={"inline-block"}>
                <Text fontSize="xl">{product.endTimeDetailsFormat}</Text>
              </Box>
            </ListItem>
            <ListItem>
              <ListIcon
                as={() => (
                  <FontAwesomeIcon icon={faCheckCircle} color="green" />
                )}
              />{" "}
              참여 인원 :{" "}
              <Box mb={5} display={"inline-block"}>
                <Text fontSize="xl">{product.numberOfJoin}명</Text>
              </Box>
            </ListItem>
          </List>

          {/*판매 완료, 로그인이 안되어 있는 상태, 자신의 상품일 때 보이지 않음*/}
          {(account.isLoggedIn() && account.hasAccess(product.userId)) || (
            <Box mb={5}>
              <Flex w={"100%"}>
                <Box w={"100%"} mr={4}>
                  <Button
                    w={"100%"}
                    h={"60px"}
                    fontSize={"lg"}
                    onClick={handleLikeClick}
                    leftIcon={
                      <FontAwesomeIcon
                        icon={like.like ? fullHeart : emptyHeart}
                        size="lg"
                      />
                    }
                    colorScheme={like.like ? "red" : "gray"}
                    variant="outline"
                  >
                    <Text fontSize={"lg"}>{like.count} </Text>
                  </Button>
                </Box>

                {!product.status ||
                  !account.isLoggedIn() ||
                  account.hasAccess(product.userId) || (
                    <Box w={"100%"} mr={4}>
                      <Button
                        h={"60px"}
                        colorScheme="green"
                        w="100%"
                        onClick={onOpen}
                        fontSize={"lg"}
                        leftIcon={<FontAwesomeIcon icon={faHandHoldingUsd} />}
                      >
                        참여하기
                      </Button>
                    </Box>
                  )}
                {(product.status && !account.isLoggedIn()) ||
                  account.hasAccess(product.userId) || (
                    <Box w={"100%"} mr={4}>
                      <Button
                        colorScheme="teal"
                        w="100%"
                        h={"60px"}
                        leftIcon={<FontAwesomeIcon icon={faCommentDots} />}
                        onClick={handleEnterChatRoom}
                        fontSize={"lg"}
                      >
                        문의하기
                      </Button>
                    </Box>
                  )}
              </Flex>
            </Box>
          )}
          {!account.isLoggedIn() ||
            (account.hasAccess(product.userId) && (
              <Box mb={5}>
                <Button
                  colorScheme="green"
                  w="100%"
                  h={"60px"}
                  fontSize={"lg"}
                  onClick={() => navigate(`/edit/${product.id}`)}
                >
                  상품수정
                </Button>
              </Box>
            ))}
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

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
            <Box
              mb={6}
              p={4}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              <Box>
                <Heading fontSize="lg" mb={4}>
                  경매 참여 시 유의사항
                </Heading>

                <OrderedList>
                  <ListItem mb={2}>
                    경매 참여는 신중하게 결정해야 합니다.
                  </ListItem>
                  <ListItem mb={2}>
                    중복 참여는 가능하나 마지막으로 기록된 입찰 금액으로만
                    경매에 참여하게 됩니다.
                  </ListItem>
                  <ListItem mb={2}>
                    경매 종료 후 낙찰여부는{" "}
                    <Box as="span" fontWeight="bold" color="blue.500">
                      마이 페이지에서 확인 가능
                    </Box>
                    합니다.
                  </ListItem>
                  <ListItem mb={2}>
                    입찰 금액을 입력할 때 반드시 제시된 가격보다 같거나 높아야
                    합니다.
                  </ListItem>
                </OrderedList>
              </Box>
            </Box>
            <FormControl mb={4}>
              <FormLabel mb={4}>입찰 금액</FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  value={formattedPrice(bidPrice)}
                  onChange={(e) => handleIntegerNumber(e)}
                  placeholder="숫자만 입력하세요."
                  borderRadius="none"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
                />
                <InputRightAddon>원</InputRightAddon>
              </InputGroup>
              {parseInt(bidPrice) < product.startPrice && (
                <FormHelperText color="red" mt={2}>
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
              loadingText="처리중"
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
