import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./component/Navbar.jsx";
import { Header } from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import { CategoryMenu } from "./component/category/CategoryMenu.jsx";

export function Home() {
  return (
    <Box h="100%">
      <Box>
        <Navbar />
      </Box>
      <Box
        mx={{
          base: 0,
          lg: 150,
        }}
        mb={10}
        minHeight="500px"
        position="relative"
        paddingBottom="100px"
      >
        <Box mt={6} mb={10}>
          <Header />
          <CategoryMenu />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>

      <Box
        mt={20}
        position="absolute"
        width="100%"
        h={"30px"}
        lineHeight="30px"
      >
        <Footer />
      </Box>
    </Box>
  );
}
