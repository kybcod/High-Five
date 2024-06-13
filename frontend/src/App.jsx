import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import { ProductList } from "./product/ProductList.jsx";
import { ProductUpload } from "./product/ProductUpload.jsx";
import { MainProduct } from "./product/MainProduct.jsx";
import { ProductEdit } from "./product/ProductEdit.jsx";
import { ProductView } from "./product/ProductView.jsx";
import { SignUp } from "./user/SignUp.jsx";
import { Login } from "./Login.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import axios from "axios";
import { QuestionWrite } from "./QuestionWrite.jsx";
import { QuestionList } from "./QuestionList.jsx";
import { BoardWrite } from "./board/BoardWrite.jsx";
import { BoardList } from "./board/BoardList.jsx";
import { BoardView } from "./board/BoardView.jsx";
import { BoardModify } from "./board/BoardModify.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChatRoom } from "./chat/ChatRoom.jsx";
import { UserAuth } from "./UserAuth.jsx";

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
      { path: "product/:id", element: <ProductView /> },
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
      { path: "question", element: <QuestionWrite /> },
      { path: "question-list", element: <QuestionList /> },
      { path: "board", element: <BoardWrite /> },
      { path: "board/list", element: <BoardList /> },
      { path: "board/:board_id", element: <BoardView /> },
      { path: "board/modify/:board_id", element: <BoardModify /> },
      { path: "chat", element: <ChatRoom /> },
      { path: "user/auth", element: <UserAuth /> },
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
