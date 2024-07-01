import React from "react";
import Slider from "react-slick";
import {
  Badge,
  Box,
  Card,
  CardBody,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { SamplePrevArrow } from "./SamplePrevArrow.jsx";
import { SampleNextArrow } from "./SampleNextArrow.jsx";

const LivePopularProductSlider = ({
  product,
  likes,
  handleLikeClick,
  account,
}) => {
  const sliderRef = React.useRef(null);

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "40px",
    slidesToShow: 3,
    speed: 500,
    dots: false,
    slidesToScroll: 1,
    arrows: false, // 기본 화살표 숨기기
    afterChange: (current) => setCurrentSlide(current),
  };

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const navigate = useNavigate();

  return (
    <Box>
      <Box position="relative">
        <SamplePrevArrow onClick={previous} />
        <SampleNextArrow onClick={next} />

        {/* 슬라이더 */}
        <Slider {...settings} ref={sliderRef}>
          {product.map((product, index) => (
            <Box key={index} width={"100%"} px={2}>
              <Flex
                alignItems="center"
                justifyContent="center"
                width="100%"
                opacity={currentSlide === index ? 1 : 0.3}
                transition="opacity 0.3s"
              >
                <Card
                  onClick={() => navigate(`/product/${product.id}`)}
                  w={"70%"}
                  boxShadow={"none"}
                  cursor={"pointer"}
                  maxW="sm"
                  h="100%"
                  borderRadius={"5px"}
                  overflow="hidden"
                  bgColor={"#F7F7F7"}
                >
                  <CardBody position="relative" h="100%" p={0}>
                    <Box position="relative">
                      <Image
                        src={product.productFileList[0].filePath}
                        w="100%"
                        h="250px"
                        transition="transform 0.2s"
                        _hover={{ transform: "scale(1.05)" }}
                      />
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Text
                          fontSize={"xl"}
                          fontWeight={"600"}
                          w={10}
                          h={10}
                          bgColor={"white"}
                          borderRadius={"5px"}
                          position="absolute"
                          top={2}
                          left={2}
                          display={"flex"}
                          justifyContent={"center"}
                          alignItems={"center"}
                          textAlign={"center"}
                        >
                          {index + 1}
                        </Text>
                      </Box>

                      {account.isLoggedIn() && (
                        <Box
                          position="absolute"
                          top={2}
                          right={2}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeClick(product.id);
                          }}
                          transition="transform 0.2s"
                          _hover={{ transform: "scale(1.1)" }}
                        >
                          <FontAwesomeIcon
                            icon={likes[product.id] ? fullHeart : emptyHeart}
                            style={{ color: "red" }}
                            size="xl"
                          />
                        </Box>
                      )}
                      {!product.status && (
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bg="blackAlpha.600"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color="white" fontSize="2xl" fontWeight="bold">
                            판매완료
                          </Text>
                        </Box>
                      )}
                    </Box>
                    <Box p={3} textAlign="left">
                      <Text fontSize="lg" fontWeight="500" noOfLines={1} mb={1}>
                        {product.title}
                      </Text>
                      <Flex mb={3} alignItems="baseline">
                        <Text fontSize="xl" fontWeight="bold" mr={2}>
                          {product.startPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                          원
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          (시작가)
                        </Text>
                      </Flex>
                      <Badge color={"black"} colorScheme={"yellow"}>
                        {product.endTimeFormat}
                      </Badge>
                    </Box>
                  </CardBody>
                </Card>
              </Flex>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default LivePopularProductSlider;
