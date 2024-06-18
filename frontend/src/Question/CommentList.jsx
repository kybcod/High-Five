import axios from "axios";
import {
  Box,
  Card,
  CardBody,
  Stack,
  StackDivider,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { Comment } from "./Comment.jsx";

export function CommentList({ questionId }) {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    // if (!isProcessing) {
    console.log("Received questionId:", questionId); // questionId 로그 추가
    if (questionId) {
      axios
        .get(`/api/question/comment/${questionId}`)
        .then((res) => setCommentList(res.data))
        .catch((err) => console("comment error!!!", err));
      // }
    }
  }, []);

  return (
    <Box>
      <Card>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={4}>
            {commentList.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
