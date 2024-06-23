import axios from "axios";
import { Box, Card, CardBody, Stack, StackDivider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Comment } from "./Comment.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesUp } from "@fortawesome/free-solid-svg-icons";

export function CommentList({ questionId }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    // if (!isProcessing) {
    console.log("Received questionId:", questionId); // questionId 로그 추가
    if (questionId) {
      axios
        .get(`/api/question/comment/${questionId}`)
        .then((res) => setCommentList(res.data))
        .catch(() => {});
      // }
    }
  }, []);

  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트 핸들러를 설정합니다.
  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 화면 맨 위로 스크롤합니다.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 컴포넌트가 마운트될 때와 언마운트될 때 스크롤 이벤트를 등록하고 해제합니다.
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const buttonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "100px",
    zIndex: 1000,
    cursor: "pointer",
    transition: "opacity 0.3s, visibility 0.3s",
    display: isVisible ? "block" : "none",
  };

  return (
    <Box>
      {commentList.length > 0 && (
        <Card>
          <CardBody>
            <Stack divider={<StackDivider />} spacing={4}>
              {commentList.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))}
            </Stack>
          </CardBody>
        </Card>
      )}
      {isVisible && (
        <Box onClick={scrollToTop} style={buttonStyle}>
          <FontAwesomeIcon icon={faAnglesUp} size="2xl" />
        </Box>
      )}
    </Box>
  );
}
