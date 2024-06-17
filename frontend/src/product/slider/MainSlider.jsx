// MainSlider.jsx
import React from "react";
import { Box, Image } from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Styled_Slide } from "./Styled_Slide";

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
    <Box width="100%" mt={10}>
      <Styled_Slide {...settings}>
        <Box width="100%" height="300px" boxSize={"full"}>
          <Image
            src="/img/nike.png"
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </Box>
        <Box width="100%" height="300px" boxSize={"full"}>
          <Image
            src="/img/iphone.png"
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </Box>
        <Box width="100%" height="300px" boxSize={"full"}>
          <Image
            src="/img/auction.png"
            width="100%"
            height="100%"
            objectFit="contain"
          />
        </Box>
      </Styled_Slide>
    </Box>
  );
}
