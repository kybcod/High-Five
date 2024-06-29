import React from "react";
import { Box, Button, Flex } from "@chakra-ui/react";

export function SortButton({ sortOption, handleSortChange }) {
  return (
    <Flex justifyContent="flex-end" mb={4}>
      <Button
        fontSize="small"
        fontWeight="normal"
        color={sortOption === "0" ? "red" : "black"}
        variant="unstyled"
        onClick={() => handleSortChange("0")}
      >
        최신순
      </Button>
      <Box m={2} height="24px" borderLeft="1px solid #ccc" />
      <Button
        variant="unstyled"
        fontWeight="normal"
        onClick={() => handleSortChange("1")}
        fontSize="small"
        color={sortOption === "1" ? "red" : "black"}
      >
        인기순
      </Button>
      <Box m={2} height="24px" borderLeft="1px solid #ccc" />
      <Button
        variant="unstyled"
        fontWeight="normal"
        onClick={() => handleSortChange("2")}
        fontSize="small"
        color={sortOption === "2" ? "red" : "black"}
      >
        저가순
      </Button>
      <Box m={2} height="24px" borderLeft="1px solid #ccc" />
      <Button
        variant="unstyled"
        fontWeight="normal"
        onClick={() => handleSortChange("3")}
        fontSize="small"
        color={sortOption === "3" ? "red" : "black"}
      >
        고가순
      </Button>
    </Flex>
  );
}
