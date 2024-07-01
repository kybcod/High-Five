import { Box } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const SampleNextArrow = ({ onClick }) => {
  return (
    <Box
      width={"50px"}
      height={"50px"}
      bgColor={"#F7F7F7"}
      borderRadius="50%"
      position="absolute"
      transform="translateY(-50%)"
      top="50%"
      right="10px"
      // color="#06A458"
      color="teal"
      fontSize="30px"
      zIndex="1"
      cursor="pointer"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faChevronRight} size={"lg"} />
    </Box>
  );
};
