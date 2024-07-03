import {
  Box,
  Button,
  Divider,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";

export function Payment() {
  const { userId, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [merchantUid, setMerchantUid] = useState("");
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerTel, setBuyerTel] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [bidListId, setBidListId] = useState(0);
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(iamport);
    };
  }, []);

  // get 요청 : bidList : bid_id로 받아오기: 상세 페이지 처럼 bid_list 관련 정보 가져오기
  // productId랑 해당 상품을 올린 판매자의 userId

  useEffect(() => {
    axios.get(`/api/payments/${userId}/${productId}`).then((res) => {
      setAmount(res.data.amount);
      setName(res.data.name);
      setBuyerName(res.data.buyerName);
      setBuyerTel(res.data.buyerTel);
      setBuyerEmail(res.data.buyerEmail);
      setBidListId(res.data.bidListId);
      generateMerchantUid();
    });

    axios.get(`/api/products/${productId}`).then((res) => {
      console.log(res.data);
      setProduct(res.data.product);
    });
  }, []);

  // 주문번호 랜덤으로 받기
  function generateMerchantUid() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let orderNum = month + day;
    for (let i = 0; i < 10; i++) {
      orderNum += Math.floor(Math.random() * 8);
    }
    setMerchantUid(orderNum);
  }

  function onClickPayment() {
    const { IMP } = window;
    IMP.init(import.meta.env.VITE_SOME_KEY);

    const data = {
      pg: "html5_inicis", // PG사
      pay_method: "card", // 결제수단
      merchant_uid: merchantUid, // 주문번호
      amount: amount, // 결제금액
      name: name, // 주문명
      buyer_name: buyerName, // 구매자 이름
      buyer_tel: buyerTel, // 구매자 전화번호
      buyer_email: buyerEmail, // 구매자 이메일
      m_redirect_url: "", // 모바일 결제 후 리디렉션될 URL : 채팅방으로
    };
    // TODO : redirect_url : 채팅방으로 연결

    IMP.request_pay(data, callback);

    function callback(response) {
      const { success, error_msg } = response;

      if (success) {
        axios
          .post(`/api/payments`, {
            merchantUid,
            amount,
            bidListId,
          })
          .then(() => {
            alert(`${amount}원이 결제되었습니다.`);
          })
          .finally(() => {
            navigate(`/chat/product/${product.id}/buyer/${account.id}`);
          });
      } else {
        alert(`${error_msg} 이유로 결제를 실패하였습니다.`);
      }
    }
  }

  if (product === null) {
    return <Spinner />;
  }

  return (
    <Box
      maxW="600px"
      mx="auto"
      p={5}
      boxShadow="xl"
      borderRadius="lg"
      bg="white"
    >
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={5}>
        주문 정보
      </Text>
      <Divider mb={5} />
      <VStack spacing={4} align="stretch" display={"flex"}>
        <Box>
          <Text mb={4} fontSize="lg" fontWeight="semibold">
            주문상품
          </Text>
          <Box
            height="400px"
            width="400px"
            display={"flex"}
            justifyContent="center"
            alignItems="center"
            mb={7}
            boxSizing="border-box"
            mx={"auto"}
          >
            <Image
              src={product.productFileList[0].filePath}
              alt={name}
              height="100%"
              width="100%"
              objectFit="contain"
            />
          </Box>
        </Box>
        <Box>
          <Text mb={4} fontSize="lg" fontWeight="semibold">
            판매자 명:
          </Text>
          <Text mb={4} fontSize="md">
            {buyerName}
          </Text>
        </Box>
        <Box>
          <Text mb={4} fontSize="lg" fontWeight="semibold">
            상품명:
          </Text>
          <Text mb={4} fontSize="md">
            {name}
          </Text>
        </Box>
        <Box>
          <Text mb={4} fontSize="lg" fontWeight="semibold">
            결제 가격:
          </Text>
          <Text fontSize="md">{amount.toLocaleString()} 원</Text>
        </Box>
        <Button
          onClick={onClickPayment}
          colorScheme="teal"
          size="lg"
          mt={5}
          boxShadow="lg"
          _hover={{ bg: "teal.600" }}
          isLoading={false}
          loadingText={"로딩중"}
        >
          결제하기
        </Button>
      </VStack>
    </Box>
  );
}
