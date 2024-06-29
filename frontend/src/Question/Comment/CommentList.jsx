import axios from "axios";
import { Box, Card, CardBody, Stack, StackDivider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Comment } from "./Comment.jsx";
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "../Icon.jsx";

export function CommentList({ questionId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트 핸들러 설정
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

  const scrollToDown = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!isProcessing) {
      if (questionId) {
        axios
          .get(`/api/question/comment/${questionId}`)
          .then((res) => setCommentList(res.data))
          .catch(() => {});
      }
    }
  }, [isProcessing]);

  // 컴포넌트가 마운트될 때와 언마운트될 때 스크롤 이벤트를 등록하고 해제
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const buttonStyle = (isTop) => ({
    position: "fixed",
    bottom: isTop ? "220px" : "150px",
    // right={["20px", "50px", "100px"]} // chakra ui 반응형으로 설정
    right: "30px",
    zIndex: 1000,
    cursor: "pointer",
    transition: "opacity 0.3s, visibility 0.3s",
    display: isVisible ? "block" : "none",
  });

  return (
    <Box>
      {commentList.length === 0 && (
        <Box fontWeight={"500"} pb={30}>
          댓글이 없습니다.
        </Box>
      )}
      {commentList.length > 0 && (
        <Card>
          <CardBody>
            <Stack divider={<StackDivider />} spacing={4}>
              {commentList.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              ))}
            </Stack>
          </CardBody>
        </Card>
      )}
      {isVisible && (
        <>
          <Box onClick={scrollToTop} style={buttonStyle(true)}>
            <ArrowUpCircleIcon />
          </Box>
          <Box onClick={scrollToDown} style={buttonStyle(false)}>
            <ArrowDownCircleIcon />
          </Box>
        </>
      )}
    </Box>
  );
}
