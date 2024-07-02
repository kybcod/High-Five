import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Image, Text } from "@chakra-ui/react";
import { SampleNextArrow } from "../../product/main/SampleNextArrow.jsx";
import { SamplePrevArrow } from "../../product/main/SamplePrevArrow.jsx";

function SimpleSlider({ images, isBrightness }) {
  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: images.length > 1,
    nextArrow: images.length > 1 ? <SampleNextArrow /> : null,
    prevArrow: images.length > 1 ? <SamplePrevArrow /> : null,
    centerMode: false,
    overflow: "hidden",
  };

  return (
    <Slider {...settings}>
      {images.map((file, index) => (
        <Box key={index} position="relative" width="100%" height="475px">
          <Image
            src={file.filePath}
            className="slick-custom-image"
            width="100%"
            height="100%"
            objectFit="contain"
            filter={isBrightness ? "brightness(50%)" : "none"}
          />
          {isBrightness && (
            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              color="white"
              fontSize="2xl"
              as="b"
              p={4}
              borderRadius="md"
            >
              판매완료
            </Text>
          )}
        </Box>
      ))}
    </Slider>
  );
}

export default SimpleSlider;
