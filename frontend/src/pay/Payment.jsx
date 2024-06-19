import { Box, Button } from "@chakra-ui/react";
import { useEffect } from "react";

export function Payment() {
  useEffect(() => {
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/v1/iamport.js";
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(iamport);
    };
  }, []);

  // get 요청 : bidList : bid_id로 받아오기: 상세 페이지 처럼 bid_list 관련 정보 가져오기
  // 상태로 setXXX() 받아오기

  function onClickPayment() {
    const { IMP } = window;
    IMP.init(import.meta.env.VITE_SOME_KEY);

    const data = {
      pg: "html5_inicis", // PG사
      pay_method: "card", // 결제수단
      merchant_uid: `merchant_${new Date().getTime()}`, // 주문번호
      amount: 100, // 결제금액
      name: "아임포트 결제 데이터 분석", // 주문명
      buyer_name: "홍길동", // 구매자 이름
      buyer_tel: "01012341234", // 구매자 전화번호
      buyer_email: "example@example", // 구매자 이메일
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
