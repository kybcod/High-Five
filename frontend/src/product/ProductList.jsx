import {
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

export function ProductList() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then((res) => setProductList(res.data));
  }, []);

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
            <Card maxW="sm">
              <CardBody>
                {product.productFileList &&
                product.productFileList.length > 0 ? (
                  <Image
                    src={product.productFileList[0].filePath}
                    borderRadius="lg"
                    w="100%"
                    h="200px"
                  />
                ) : (
                  <Box
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="100%"
                    h="200px"
                    border="1px solid gray"
                  >
                    <Text>해당 이미지가 없습니다</Text>
                  </Box>
                )}
                <Stack mt="6" spacing="3">
                  <Heading size="m">{product.title}</Heading>
                  <Flex justifyContent={"space-between"}>
                    <Text color="blue.600" fontSize="xl">
                      {product.startPrice}
                    </Text>
                    <Text>{product.startTime}</Text>
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
