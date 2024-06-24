// MainSlider.jsx
import React from "react";
import { Box, Image } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Styled_Slide } from "./Styled_Slide";

const bannerData = [
  {
    id: 1,
    src: "https://media.bunjang.co.kr/images/nocrop/1200638310_w1197.jpg",
  },
  {
    id: 2,
    src: "https://media.bunjang.co.kr/images/nocrop/1200637633_w1197.jpg",
  },
  {
    id: 3,
    src: "https://product-image.kurly.com/hdims/resize/%3E1900x%3E370/quality/85/src/banner/main/pc/img/93b644d1-ec1e-4026-9ebc-d79c1817d2ed.jpg",
  },
  {
    id: 4,
    src: "https://product-image.kurly.com/hdims/resize/%3E1900x%3E370/quality/85/src/banner/main/pc/img/93b644d1-ec1e-4026-9ebc-d79c1817d2ed.jpg",
  },
  {
    id: 4,
    src: "https://product-image.kurly.com/hdims/resize/%3E1900x%3E370/quality/85/src/banner/main/pc/img/93b644d1-ec1e-4026-9ebc-d79c1817d2ed.jpg",
  },
];

export function MainSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: false,
    centerPadding: "0px",
  };

  return (
    <Box width="100%" mt={10} mb={10}>
      <Styled_Slide {...settings}>
        {bannerData.map((banner) => (
          <Box key={banner.id} width="100%" height="500px" boxSize={"full"}>
            <Image
              src={banner.src}
              width="100%"
              height="100%"
              objectFit="cover"
            />
          </Box>
        ))}
      </Styled_Slide>
    </Box>
  );
}
