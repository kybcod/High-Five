import { Button } from "@chakra-ui/react";

export const ProductStateComp = ({ productInfo, userId }) => {
  let productStateText = "";
  if (productInfo.status == 0 && productInfo.buyerId == userId) {
    // 후기 작성 모달 떠야함
    productStateText = "거래완료";
  } else if (productInfo.status == 1) {
    // 상품 디테일 페이지로 이동
    productStateText = "입찰가능";
  } else {
    // 버튼 readOnly
    productStateText = "판매종료";
  }
  return (
    <>
      <Button colorScheme={"yellow"}>{productStateText}</Button>
    </>
  );
};
