import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function Payment() {
  const { userId, productId } = useParams();
  const [bidList, setBidList] = useState(null);
  const [merchantUid, setMerchantUid] = useState("");
  const [amount, setAmount] = useState(0);
  const [name, setName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerTel, setBuyerTel] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");

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
      console.log(res.data);
      // const productList = res.data.productList;
    });
  }, []);

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
      m_redirect_url: "", // 모바일 결제 후 리디렉션될 URL
    };

    IMP.request_pay(data, callback);

    function callback(response) {
      const { success, error_msg } = response;

      if (success) {
        //post 요청 : payment (merchant_uid, bid_id, 결제 상태 : true)
        alert("결제 성공");
      } else {
        alert(`결제 실패: ${error_msg}`);
      }
    }
  }

  return (
    <Box>
      <Button onClick={onClickPayment}>결제하기</Button>
    </Box>
  );
}
