import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function UserAuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // URL 파라미터에서 토큰 추출
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // 토큰을 localStorage에 저장
      localStorage.setItem("token", token);

      // 토큰 저장 후 리다이렉트 (예: 홈 페이지로)
      navigate("/");
    } else {
      // 토큰이 없을 경우 에러 처리 또는 로그인 페이지로 리다이렉트
      navigate("/login");
    }
  }, [location, navigate]);

  return null;
}
