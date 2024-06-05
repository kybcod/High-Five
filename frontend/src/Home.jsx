import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./component/Navbar.jsx";
import { Header } from "./component/Header.jsx";

export function Home() {
  return (
    <Box>
      <Box>
        <Navbar />
      </Box>
      <Box>
        <Header />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
