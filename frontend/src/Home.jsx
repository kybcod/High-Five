import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.jsx";
import { Header } from "./Header.jsx";
import { Category } from "./Category.jsx";

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
        <Category />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
