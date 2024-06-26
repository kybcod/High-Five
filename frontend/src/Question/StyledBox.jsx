import { Link, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";

// 공통 스타일이 적용된 커스텀 Box 컴포넌트 생성
const StyledBox = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <Box
        mx={4}
        px={4}
        py={2}
        fontSize={"1.2rem"}
        cursor="pointer"
        borderBottom={isActive ? "2px solid red" : "none"}
        fontWeight={isActive ? "bold" : "600"}
        _hover={{ fontSize: "1.3rem", fontWeight: "bold" }}
      >
        {children}
      </Box>
    </Link>
  );
};

export default StyledBox;
