import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, IconButton, Image, Text } from "@chakra-ui/react";

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <IconButton
      aria-label="Next"
      className={className}
      style={{
        ...style,
        position: "absolute",
        display: "block",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        color: "white",
        fontSize: "20px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
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
        display: "block",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: "50%",
        color: "white",
        fontSize: "20px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
      }}
      onClick={onClick}
    />
  );
};

function SimpleSlider({ images, isBrightness }) {
  const settings = {
    dots: images.length > 1,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: images.length > 1,
    nextArrow: images.length > 1 ? <NextArrow /> : false,
    prevArrow: images.length > 1 ? <PrevArrow /> : false,
    centerMode: false,
    overflow: "hidden",
  };

  return (
    <Slider {...settings}>
      {images.map((file, index) => (
        <Box key={index} position="relative" width="100%" height="500px">
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
