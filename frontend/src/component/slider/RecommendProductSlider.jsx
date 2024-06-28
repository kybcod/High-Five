import React from "react";
import Slider from "react-slick";
import { AbsoluteCenter, Box, Divider } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ProductGrid } from "../../product/ProductGrid.jsx";

const RecommendProductSlider = ({
  recommendProduct,
  likes,
  handleLikeClick,
  account,
}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <Box>
      {/* 추천 상품 헤더 */}
      <Box position="relative" marginY="20">
        <Divider border={"1px solid teal"} />
        <AbsoluteCenter fontSize={"2xl"} fontWeight={"bold"} bg="white" px="4">
          👍 오늘의 추천 상품
        </AbsoluteCenter>
      </Box>

      {/* 슬라이더 */}
      <Slider {...settings} style={{ width: "100%", height: "100%" }}>
        {recommendProduct.map((product, index) => (
          <Box key={index} width={"100%"}>
            <Box alignItems="center" justifyContent="center" width="100%">
              <ProductGrid
                productList={[product]}
                likes={likes}
                handleLikeClick={handleLikeClick}
                account={account}
              />
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

// 커스텀 화살표 컴포넌트
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "teal" }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "teal" }}
      onClick={onClick}
    />
  );
};

export default RecommendProductSlider;
