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
import {
  faChevronLeft,
  faChevronRight,
  faHeart as fullHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

const RecommendProductSlider = ({
  recommendProduct,
  likes,
  handleLikeClick,
  account,
}) => {
  const sliderRef = React.useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: false, // 기본 화살표 숨기기
    afterChange: setCurrentSlide,
  };

  const [currentSlide, setCurrentSlide] = React.useState(0);

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

  return (
    <Box>
      <Box marginY="10">
        <Text fontSize={"larger"} fontWeight={"bold"}>
          추천 상품
        </Text>
        <Text fontSize={"medium"} fontWeight={"bold"}>
          Recommend Product
        </Text>
      </Box>

      <Box position="relative">
        {currentSlide > 0 && <SamplePrevArrow onClick={previous} />}
        {currentSlide < recommendProduct.length - settings.slidesToShow && (
          <SampleNextArrow onClick={next} />
        )}

        {/* 슬라이더 */}
        <Slider
          {...settings}
          ref={sliderRef}
          style={{ width: "100%", height: "100%" }}
        >
          {recommendProduct.map((product, index) => (
            <Box key={index} width={"100%"} px={2}>
              <Box
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Card
                  w={"100%"}
                  boxShadow={"none"}
                  borderColor={"white"}
                  borderWidth={"1px"}
                  cursor={"pointer"}
                  maxW="sm"
                  h="100%"
                  borderBottomRadius={"0"}
                  overflow="hidden"
                >
                  <CardBody position="relative" h="100%" p={0}>
                    <Box position="relative">
                      <Image
                        onClick={() => navigate(`/product/${product.id}`)}
                        src={product.productFileList[0].filePath}
                        w="100%"
                        h="250px"
                        transition="transform 0.2s"
                        _hover={{ transform: "scale(1.05)" }}
                      />
                      {account.isLoggedIn() && (
                        <Box
                          position="absolute"
                          bottom={2}
                          right={2}
                          onClick={() => handleLikeClick(product.id)}
                        >
                          <FontAwesomeIcon
                            icon={likes[product.id] ? fullHeart : emptyHeart}
                            style={{ color: "red" }}
                            size="lg"
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
                    <Box p={3}>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        noOfLines={1}
                        mb={1}
                      >
                        {product.title}
                      </Text>
                      <Text fontSize="xl" mb={1} fontWeight={"bold"}>
                        ₩{" "}
                        {product.startPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </Text>
                      <Flex justifyContent="space-between" alignItems="center">
                        <Badge
                          fontSize={"medium"}
                          bgColor={"gray.100"}
                          color={"teal"}
                        >
                          {product.endTimeFormat}
                        </Badge>
                      </Flex>
                    </Box>
                  </CardBody>
                </Card>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

// 커스텀 화살표 컴포넌트
const SampleNextArrow = ({ onClick }) => {
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      right="10px"
      color="gray"
      fontSize="50px"
      zIndex="1"
      cursor="pointer"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} />
    </Box>
  );
};

const SamplePrevArrow = ({ onClick }) => {
  return (
    <Box
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      left="10px"
      color="gray"
      fontSize="50px"
      zIndex="1"
      cursor="pointer"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </Box>
  );
};

export default RecommendProductSlider;
