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
  };

  return (
    <Box width="30%" position="relative">
      <Slider {...settings}>
        {images.map((file, index) => (
          <Box key={index} position="relative" width="100%" height="200px">
            <Image
              src={file.filePath}
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
    </Box>
  );
}

export default SimpleSlider;
