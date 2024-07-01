import React, { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";

const Scroll = ({ isTop }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 화면 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 화면 맨 아래로 스크롤
  const scrollToDown = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  // 컴포넌트가 마운트될 때와 언마운트될 때 스크롤 이벤트를 등록하고 해제
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const buttonStyle = (position) => ({
    position: "fixed",
    bottom: position,
    right: "50px",
    zIndex: 1000,
    cursor: "pointer",
    transition: "opacity 0.3s, visibility 0.3s",
    display: isVisible ? "block" : "none",
  });

  return (
    <div>
      {isVisible && (
        <>
          <Box
            onClick={scrollToTop}
            style={buttonStyle(isTop ? "90px" : "50px")}
          >
            <Image src={"/img/arrowTop.png"} boxSize={"40px"} />
          </Box>
          {/*<Box onClick={scrollToDown} style={buttonStyle("100px")}>*/}
          {/*</Box>*/}
        </>
      )}
    </div>
  );
};

export default Scroll;
