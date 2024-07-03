import axios from "axios";
import { Box, Card, CardBody, Stack, StackDivider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Comment } from "./Comment.jsx";
import Scroll from "../Scroll.jsx";

export function CommentList({ questionId, isProcessing, setIsProcessing }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      if (questionId) {
        axios
          .get(`/api/question/comment/${questionId}`)
          .then((res) => setCommentList(res.data))
          .catch(() => {});
      }
    }
  }, [isProcessing, questionId]);

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
      <Scroll isTop={true} />
    </Box>
  );
}
