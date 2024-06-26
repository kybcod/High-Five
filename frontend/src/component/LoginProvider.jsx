import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [expired, setExpired] = useState(0);
  const [authority, setAuthority] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      return;
    }
    login(token);
  }, []);

  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  function hasAccess(param) {
    return id == param;
    // 받을 때 타입 다른 경우 때문에 == 연산자 사용
  }

  function isAdmin() {
    return authority.includes("admin");
  }

  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setEmail(payload.email);
    setId(payload.sub);
    setNickName(payload.nickName);
    setAuthority(payload.scope.split(" "));
    setProfileImage(payload.profileImage);
  }

  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setId("");
    setNickName("");
    setAuthority([]);
    setEmail("");
    setNickName("");
  }

  return (
    <LoginContext.Provider
      value={{
        id: id,
        nickName: nickName,
        email: email,
        profileImage: profileImage,
        authority: authority,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        hasAccess: hasAccess,
        isAdmin: isAdmin,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
