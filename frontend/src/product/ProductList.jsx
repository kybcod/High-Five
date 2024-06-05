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

export function ProductList() {
  // 샘플 데이터
  const products = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    title: "제목",
    inserted: `2024.06.03 12:00`,
    price: `가격`,
    imageUrl:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  }));

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
        {products.map((product) => (
          <GridItem key={product.id}>
            <Card maxW="sm">
              <CardBody>
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  borderRadius="lg"
                />
                <Stack mt="6" spacing="3">
                  <Heading size="m">{product.title}</Heading>
                  <Flex justifyContent={"space-between"}>
                    <Text color="blue.600" fontSize="xl">
                      {product.price}
                    </Text>
                    <Text>{product.inserted}</Text>
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
