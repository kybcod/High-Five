import {
  Badge,
  Box,
  Card,
  CardBody,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Category } from "../component/Category.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function MainProduct() {
  const [productList, setProductList] = useState([]);
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products`).then((res) => setProductList(res.data));
  }, []);

  function handleLikeClick() {
    axios
      .put("/api/products/like", { productId: productList.id })
      .then((res) => setLike(res.data));
  }

  return (
    <Box>
      <Category />
      <Center w="100%">
        <Box h={"100px"} border={"1px solid black"}>
          <Box>이미지 배너</Box>
        </Box>
      </Center>
      <Heading my={4}>오늘의 상품</Heading>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        {productList.map((product) => (
          <GridItem key={product.id}>
            <Card
              maxW="sm"
              h="100%"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardBody position="relative" h="100%">
                <Box mt={2} w="100%">
                  {product.productFileList && (
                    <Image
                      src={product.productFileList[0].filePath}
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
                    {product.endTimeFormat}
                  </Badge>
                </Box>
                <Stack mt="6" spacing="3">
                  <Flex justifyContent={"space-between"}>
                    <Heading size="m">{product.title}</Heading>
                    <Box onClick={handleLikeClick}>
                      {like.like && (
                        <FontAwesomeIcon
                          icon={fullHeart}
                          style={{ color: "red" }}
                          cursor={"pointer"}
                          size={"xl"}
                        />
                      )}
                      {like.like || (
                        <FontAwesomeIcon
                          icon={emptyHeart}
                          style={{ color: "red" }}
                          cursor={"pointer"}
                          size={"xl"}
                        />
                      )}
                    </Box>
                  </Flex>
                  <Flex justifyContent={"space-between"}>
                    <Text color="blue.600" fontSize="xl">
                      {product.startPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      원
                    </Text>
                    <Text>{product.startTimeFormat}</Text>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
