import { ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Home } from "./Home.jsx";
import { ProductList } from "./product/ProductList.jsx";
import { ProductUpload } from "./product/Upload/ProductUpload.jsx";
import { MainProduct } from "./product/MainProduct.jsx";
import { ProductEdit } from "./product/ProductEdit.jsx";
import { ProductDetails } from "./product/ProductDetails.jsx";
import { SignUp } from "./user/SignUp.jsx";
import { Login } from "./user/Login.jsx";
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
import { UserList } from "./user/UserList.jsx";
import { ChatRoomList } from "./chat/ChatRoomList.jsx";
import { UserEdit } from "./myPage/UserEdit.jsx";
import { UserEmail } from "./user/UserEmail.jsx";
import SignupCodeProvider from "./component/SignupCodeProvider.jsx";
import { UserPassword } from "./user/UserPassword.jsx";
import { Payment } from "./pay/Payment.jsx";
import { UserAuthSuccess } from "./user/oauth/UserAuthSuccess.jsx";
import { SignupPhoneNumber } from "./user/SignupPhoneNumber.jsx";
import { theme } from "./Theme.jsx";

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
      //   product
      { index: true, element: <MainProduct /> },
      { path: "write", element: <ProductUpload /> },
      { path: "list", element: <ProductList /> },
      { path: "edit/:id", element: <ProductEdit /> },
      { path: "product/:id", element: <ProductDetails /> },

      // user
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
      { path: "user/list", element: <UserList /> },
      { path: "user/email", element: <UserEmail /> },
      { path: "user/password", element: <UserPassword /> },
      { path: "user/auth/success", element: <UserAuthSuccess /> },
      { path: "signup/phone_number", element: <SignupPhoneNumber /> },

      //question
      { path: "question/write", element: <QuestionWrite /> },
      { path: "question/list", element: <QuestionList /> },
      { path: "question/:id", element: <QuestionView /> },
      { path: "question/edit/:id", element: <QuestionEdit /> },

      //board
      { path: "board", element: <BoardWrite /> },
      { path: "board/list", element: <BoardList /> },
      { path: "board/:board_id", element: <BoardView /> },
      { path: "board/modify/:board_id", element: <BoardModify /> },

      //my page
      { path: "myPage/:userId", element: <Navigate to="userInfo" /> },
      { path: "myPage/:userId/userInfo", element: <MyPage tab="userInfo" /> },
      { path: "myPage/:userId/userEdit", element: <UserEdit /> },
      { path: "myPage/:userId/like", element: <MyPage tab="like" /> },
      { path: "myPage/:userId/shop", element: <MyPage tab="shop" /> },
      { path: "myPage/:userId/bids", element: <MyPage tab="bids" /> },
      { path: "myPage/:userId/reviews", element: <MyPage tab="reviews" /> },

      // chat
      {
        path: "chat/product/:productId/buyer/:buyerId",
        element: <ChatRoom />,
      },
      { path: "chat/list", element: <ChatRoomList /> },

      //pay
      { path: "pay/buyer/:userId/product/:productId", element: <Payment /> },
    ],
  },
]);

function App() {
  return (
    <LoginProvider>
      <SignupCodeProvider>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
        </ChakraProvider>
      </SignupCodeProvider>
    </LoginProvider>
  );
}

export default App;
