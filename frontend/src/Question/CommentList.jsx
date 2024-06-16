import axios from "axios";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Input,
  Stack,
  StackDivider,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export function CommentList({ questionId }) {
  const [question, setQuestion] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/question/comment/${questionId}`)
      .then((res) => setQuestion(res.data));
  }, [questionId]);

  return (
    <Box>
      <Card>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={4}>
            {question.map((comment) => (
              <Flex gap={3}>
                <input
                  value={comment.userId === 30 ? "관리자" : comment.userId}
                  key={comment.id}
                />
                <Input value={comment.content} key={comment.id} />
                <Input value={comment.inserted} key={comment.id} />
              </Flex>
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
