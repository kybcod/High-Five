import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./component/Navbar.jsx";
import { Header } from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";

export function Home() {
  return (
    <Box
      mx={{
        base: 0,
        lg: 200,
      }}
      mb={10}
    >
      <Box>
        <Navbar />
      </Box>
      <Box>
        <Box mb={10}>
          <Header />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
      <Box mt={10}>
        <Footer />
      </Box>
    </Box>
  );
}
