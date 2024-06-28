import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./component/Navbar.jsx";
import { Header } from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";

export function Home() {
  return (
    <Box>
      <Box>
        <Navbar />
      </Box>
      <Box
        mx={{
          base: 0,
          lg: 150,
        }}
        mb={10}
      >
        <Box mt={6} mb={10}>
          <Header />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
      <Box mt={20}>
        <Footer />
      </Box>
    </Box>
  );
}
