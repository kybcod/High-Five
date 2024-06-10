import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
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
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [existingFilePreviews, setExistingFilePreviews] = useState([]);
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/products/${id}`).then((res) => {
      setProduct(res.data);
      setExistingFilePreviews(res.data.productFileList || []);
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

  return (
    <Box>
      <Box>
        <FormControl>
          <FormLabel>상품 이미지</FormLabel>
        </FormControl>
        <Flex>
          <Center>
            {product.productFileList && product.productFileList[0] && (
              <Image
                src={product.productFileList[0].filePath}
                borderRadius="lg"
                w="100%"
                h="200px"
              />
            )}
            {/*/!* 기존 이미지 표시 *!/*/}
            {/*{existingFilePreviews.map((file, index) => (*/}
            {/*  <Box boxSize={"180px"} key={index} position="relative">*/}
            {/*    <Image boxSize={"180px"} src={file.filePath} mr={2} />*/}
            {/*  </Box>*/}
            {/*))}*/}
          </Center>
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
              <Button>찜</Button>
              <Box>
                <FontAwesomeIcon icon={faEye} />
                {product.viewCount}
              </Box>
              <Button>문의하기</Button>
              <Button>신고하기</Button>
            </Flex>

            <Box>
              <Heading> {product.endTimeFormat} </Heading>
            </Box>
            <Box>
              <Heading>현재 참여 인원 N명</Heading>
            </Box>
            <Box>
              <Button>참여하기</Button>
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
          <ModalBody>정말로 참여하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button>확인</Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
