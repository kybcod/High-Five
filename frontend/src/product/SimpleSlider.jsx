import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, IconButton, Image } from "@chakra-ui/react";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <IconButton
      aria-label="Next"
      className={className}
      style={{
        ...style,
        position: "absolute",
        backgroundColor: "black",
        display: "block",
        right: 0,
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <IconButton
      aria-label="Previous"
      className={className}
      style={{
        ...style,
        position: "absolute",
        backgroundColor: "black",
        display: "block",
        left: 0,
        zIndex: 1,
      }}
      onClick={onClick}
    />
  );
};

function SimpleSlider({ images }) {
  const settings = {
    dots: images.length > 1,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // 좌,우 버튼
    nextArrow: images.length > 1 ? <NextArrow /> : false,
    prevArrow: images.length > 1 ? <PrevArrow /> : false,
  };

  return (
    <Box width="30%">
      <Slider {...settings}>
        {images.map((file, index) => (
          <Box key={index} position="relative" width="100%" height="200px">
            <Image
              position={"relative"}
              src={file.filePath}
              alt={`slide-${index}`}
              width="100%"
              height="100%"
              objectFit="contain"
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}

export default SimpleSlider;
