import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import { ProductList } from "./ProductList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [{ index: true, element: <ProductList /> }],
  },
]);
function App() {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
