import {
  Badge,
  Box,
  Button,
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
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ProductList() {
  const [productList, setProductList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/list?${searchParams}`).then((res) => {
      setProductList(res.data.content);
      setPageInfo(res.data.pageInfo);
    });
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    setSearchParams(searchParams);
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
            <Card maxW="sm">
              <CardBody position="relative">
                <Box mt={2} w="100%">
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
                  <Heading size="m">{product.title}</Heading>
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
      <Center>
        <Box mt={"30px"}>
          {pageInfo.prevPageNumber && (
            <>
              <Button mr={"10px"} onClick={() => handlePageButtonClick(1)}>
                <FontAwesomeIcon icon={faAnglesLeft} />
              </Button>
              <Button
                mr={"10px"}
                onClick={() => handlePageButtonClick(pageInfo.prevPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </Button>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <Button
              mr={"10px"}
              onClick={() => handlePageButtonClick(pageNumber)}
              key={pageNumber}
              colorScheme={
                pageNumber - 1 == pageInfo.currentPageNumber ? "teal" : "gray"
              }
            >
              {pageNumber}
            </Button>
          ))}

          {pageInfo.nextPageNumber && (
            <>
              <Button
                mr={"10px"}
                onClick={() => handlePageButtonClick(pageInfo.nextPageNumber)}
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </Button>
              <Button
                onClick={() => handlePageButtonClick(pageInfo.lastPageNumber)}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </Button>
            </>
          )}
        </Box>
      </Center>
    </Box>
  );
}
