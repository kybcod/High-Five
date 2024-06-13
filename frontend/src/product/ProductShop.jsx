import { Box, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function ProductShop() {
  const { userId } = useParams();
  const [productList, setProductList] = useState(null);

  useEffect(() => {
    console.log("ID from params:", userId);
    if (userId) {
      axios.get(`/api/products/user/${userId}`).then((res) => {
        console.log(res.data);
        setProductList(res.data);
      });
    }
  }, []);

  if (productList === null) {
    return <Spinner />;
  }

  return <Box>닉네임 상점</Box>;
}
