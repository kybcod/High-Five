import {ChakraProvider} from "@chakra-ui/react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./Home.jsx";
import {ProductList} from "./product/ProductList.jsx";
import {ProductUpload} from "./product/ProductUpload.jsx";
import {QnaCreate} from "./QnaCreate.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <ProductList /> },
      { path: "write", element: <ProductUpload /> },
      { path: "qna", element: <QnaCreate /> },
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
