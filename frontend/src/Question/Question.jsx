import { Link, Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

export function Question() {
  // 공통 스타일이 적용된 커스텀 Box 컴포넌트 생성
  const StyledBox = (props) => (
    <Box
      mx={4}
      px={4}
      py={2}
      fontSize={"1.1rem"}
      cursor="pointer"
      _hover={{
        borderBottom: "2px solid red",
        fontWeight: "bold",
      }}
      {...props}
    />
  );

  return (
    <>
      <Flex justifyContent="center" alignItems="center" my={4}>
        <Link to="/question/faq">
          <StyledBox>FAQ(자주 하는 질문)</StyledBox>
        </Link>
        <Link to="/question/list">
          <StyledBox>1:1 문의게시판</StyledBox>
        </Link>
      </Flex>
      <div>
        <Outlet />
      </div>
    </>
  );
}
