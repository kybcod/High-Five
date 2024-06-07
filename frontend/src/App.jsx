import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import { ProductList } from "./product/ProductList.jsx";
import { ProductUpload } from "./product/ProductUpload.jsx";
import { MainProduct } from "./product/MainProduct.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <MainProduct /> },
      { path: "write", element: <ProductUpload /> },
      { path: "list", element: <ProductList /> },
    ],
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
