import React from "react";
import Slider from "react-slick";
import { Box, Flex, Image } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
    src: "https://media.bunjang.co.kr/images/nocrop/1208039827_w1197.jpg",
  },
  {
    id: 4,
    src: "https://media.bunjang.co.kr/images/nocrop/1208040142_w1197.jpg",
  },
  {
    id: 5,
    src: "https://media.bunjang.co.kr/images/nocrop/1200637633_w1197.jpg",
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
    appendDots: (dots) => (
      <Flex justifyContent="center" mt="-30px">
        <ul style={{ margin: "-10px" }}> {dots} </ul>
      </Flex>
    ),
  };

  return (
    <Slider {...settings} style={{ width: "100%", height: "100%" }}>
      {bannerData.map((banner) => (
        <Box key={banner.id} width="100%" height="100%">
          <Image
            src={banner.src}
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </Box>
      ))}
    </Slider>
  );
}
