import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
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
import { useContext, useEffect, useState } from "react";
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

export function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [existingFilePreviews, setExistingFilePreviews] = useState([]);
  const [like, setLike] = useState({ like: false, count: 0 });
  const [bidPrice, setBidPrice] = useState(0);
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => {
      setProduct(res.data.product);
      setExistingFilePreviews(res.data.productFileList || []);
      setLike(res.data.like);
    });
  }, []);

  if (product === null) {
    return <Spinner />;
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
    return money?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  function handleLikeClick() {
    axios.put("/api/products/like", { productId: product.id }).then((res) => {
      setLike(res.data);
    });
  }

  function handleJoinClick() {
    axios
      .post("/api/products/join", {
        productId: id,
        userId: account.id,
        bidPrice: bidPrice,
      })
      .then((res) => {
        console.log(product.id, id, account.id, bidPrice);
      });
  }

  return (
    <Box>
      <Category />
      <Box>
        <FormControl>
          <FormLabel>상품 이미지</FormLabel>
        </FormControl>
        <Flex>
          <SimpleSlider images={existingFilePreviews} />
          <Box>
            <Box>
              <Heading fontSize={"xl"}> {product.title} </Heading>
            </Box>
            <Flex justifyContent={"space-between"}>
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
            <Divider />
            <Flex justifyContent={"space-between"}>
              <Flex>
                <Center>
                  <Box mr={2}>찜</Box>
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
                  <Box>{like.count}</Box>
                </Center>
              </Flex>
              <Flex>
                <Center>
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faEye} />
                  </Box>
                  <Box>{product.viewCount}</Box>
                </Center>
              </Flex>
              <Button>문의하기</Button>
              <Button>신고하기</Button>
            </Flex>

            <Box>
              <Heading> {product.endTimeDetailsFormat} </Heading>
            </Box>
            <Box>
              <Heading>현재 참여 인원 N명</Heading>
            </Box>
            <Box>
              <Button onClick={onOpen}>참여하기</Button>
            </Box>
            <Box>
              <Button onClick={() => navigate(`/edit/${product.id}`)}>
                상품수정
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>

      <Divider />
      <Box>
        <FormControl>
          <FormLabel>상품 정보</FormLabel>
          <Textarea defaultValue={product.content} whiteSpace={"pre-wrap"} />
        </FormControl>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>입찰 금액</FormLabel>
              <Input
                type="number"
                onChange={(e) => setBidPrice(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleJoinClick}>확인</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
