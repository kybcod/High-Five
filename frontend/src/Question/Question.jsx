import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import StyledBox from "./StyledBox";

export function Question() {
  return (
    <>
      <Flex justifyContent="space-evenly" alignItems="center" my={14}>
        <StyledBox to="/question/faq">FAQ(자주 하는 질문)</StyledBox>
        <StyledBox to="/question/list">1:1 문의게시판</StyledBox>
      </Flex>
      <div>
        <Outlet />
      </div>
    </>
  );
}
