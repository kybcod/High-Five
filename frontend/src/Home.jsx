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
          lg: 200,
        }}
        mt={10}
        mb={10}
      >
        <Box>
          <Header />
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Box>
      <Box>
        <Footer />
      </Box>
    </Box>
  );
}
