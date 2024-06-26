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
import { SampleNextArrow } from "../../product/main/SampleNextArrow.jsx";
import { SamplePrevArrow } from "../../product/main/SamplePrevArrow.jsx";
import { useNavigate } from "react-router-dom";

const ProductSlider = ({ product, likes, handleLikeClick, account }) => {
  const sliderRef = React.useRef(null);

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const settings = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: product.length < 4 ? product.length : 4,
    slidesToScroll: 4,
    arrows: false, // 기본 화살표 숨기기
    afterChange: setCurrentSlide,
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
      {product.length === 0 && (
        <Text mt={10} fontSize={"lg"} fontWeight={600}>
          오늘의 경매 상품이 없습니다.
        </Text>
      )}
      {product.length > 0 && (
        <Box position="relative">
          {currentSlide > 0 && <SamplePrevArrow onClick={previous} />}
          {currentSlide < product.length - settings.slidesToShow && (
            <SampleNextArrow onClick={next} />
          )}
          {/* 슬라이더 */}
          <Slider
            {...settings}
            ref={sliderRef}
            style={{ width: "100%", height: "100%" }}
          >
            {product.map((product, index) => (
              <Box key={index} width={"100%"} px={2}>
                <Flex alignItems="center" justifyContent="center" width="100%">
                  <Card
                    border={"1px solid #eee"}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      window.scrollTo({ top: 0, behavior: "auto" });
                    }}
                    w={"80%"}
                    boxShadow={"none"}
                    cursor={"pointer"}
                    maxW="sm"
                    h="100%"
                    overflow="hidden"
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
                            <Text
                              color="white"
                              fontSize="2xl"
                              fontWeight="bold"
                            >
                              판매완료
                            </Text>
                          </Box>
                        )}
                      </Box>
                      <Box p={3} textAlign="left">
                        <Flex justifyContent={"space-between"}>
                          <Text
                            fontSize="lg"
                            fontWeight="500"
                            noOfLines={1}
                            mb={1}
                            mr={1}
                          >
                            {product.title}
                          </Text>
                          {account.isLoggedIn() && (
                            <Box
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeClick(product.id);
                              }}
                              transition="transform 0.2s"
                              _hover={{ transform: "scale(1.1)" }}
                            >
                              <FontAwesomeIcon
                                icon={
                                  likes[product.id] ? fullHeart : emptyHeart
                                }
                                style={{ color: "red" }}
                                size="xl"
                              />
                            </Box>
                          )}
                        </Flex>
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
      )}
    </Box>
  );
};

export default ProductSlider;
