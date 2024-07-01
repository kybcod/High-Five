import React from "react";
import { Button } from "@chakra-ui/react";
import { ArrowDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const LoadMoreAndFoldButton = ({
  hasNextPage,
  productListLength,
  onMoreClick,
  onFoldClick,
}) => {
  return (
    <>
      {hasNextPage ? (
        <Button
          w={"30%"}
          colorScheme={"white"}
          color={"black"}
          mt={4}
          onClick={onMoreClick}
          rightIcon={<ArrowDownIcon />}
        >
          더보기
        </Button>
      ) : (
        productListLength > 9 && (
          <Button
            w={"30%"}
            colorScheme={"white"}
            color={"black"}
            mt={4}
            rightIcon={<ChevronUpIcon />}
            onClick={onFoldClick}
          >
            접기
          </Button>
        )
      )}
    </>
  );
};

export default LoadMoreAndFoldButton;
