import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import { ProductList } from "./product/ProductList.jsx";
import { ProductUpload } from "./product/ProductUpload.jsx";
import { MainProduct } from "./product/MainProduct.jsx";
import { ProductEdit } from "./product/ProductEdit.jsx";
import { ProductDetails } from "./product/ProductDetails.jsx";
import { SignUp } from "./user/SignUp.jsx";
import { Login } from "./Login.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import axios from "axios";
import { BoardWrite } from "./board/BoardWrite.jsx";
import { BoardList } from "./board/BoardList.jsx";
import { BoardView } from "./board/BoardView.jsx";
import { BoardModify } from "./board/BoardModify.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChatRoom } from "./chat/ChatRoom.jsx";
import { QuestionWrite } from "./Question/QuestionWrite.jsx";
import { QuestionList } from "./Question/QuestionList.jsx";
import { QuestionView } from "./Question/QuestionView.jsx";
import { QuestionEdit } from "./Question/QuestionEdit.jsx";
import { MyPage } from "./myPage/MyPage.jsx";
import { ProductShop } from "./product/ProductShop.jsx";

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <MainProduct /> },
      { path: "write", element: <ProductUpload /> },
      { path: "list", element: <ProductList /> },
      { path: "edit/:id", element: <ProductEdit /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
      { path: "question/write", element: <QuestionWrite /> },
      { path: "question/list", element: <QuestionList /> },
      { path: "question/:id", element: <QuestionView /> },
      { path: "question/edit/:id", element: <QuestionEdit /> },
      { path: "board", element: <BoardWrite /> },
      { path: "board/list", element: <BoardList /> },
      { path: "board/:board_id", element: <BoardView /> },
      { path: "board/modify/:board_id", element: <BoardModify /> },
      { path: "shop/:user_id/products", element: <MyPage /> },
      { path: "shop/:userId", element: <ProductShop /> },
      { path: "chat/:product_id", element: <ChatRoom /> },
    ],
  },
]);

function App() {
  return (
    <LoginProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
