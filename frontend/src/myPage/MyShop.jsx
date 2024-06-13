import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function MyShop() {
  const [productList, setProductList] = useState(null);
  const [pageInfo, setPageInfo] = useState({});

  useEffect(() => {
    axios.get(`/api/products`).then((res) => {
      console.log(res.data);
      setProductList(res.data);
    });
  }, []);
  return (
    <Box>
      {/*<Grid templateColumns="repeat(5,lfr)" gap={6}>*/}
      {/*  {productList.map((product) => (*/}
      {/*    <GridItem key={product.id}>*/}
      {/*      <Card maxW={"s"} h={"100%"}>*/}
      {/*        <CardBody position={"relative"} h={"100%"}>*/}
      {/*          <Box>하이하이</Box>*/}
      {/*        </CardBody>*/}
      {/*      </Card>*/}
      {/*    </GridItem>*/}
      {/*  ))}*/}
      {/*</Grid>*/}
    </Box>
  );
}
