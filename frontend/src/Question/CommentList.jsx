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

export function CommentList({ questionId, isProcessing, setIsprocessing }) {
  const [question, setQuestion] = useState([]);
  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/question/comment/${questionId}`)
        .then((res) => setQuestion(res.data));
    }
  }, [isProcessing]);

  return (
    <Box>
      <Card>
        <CardBody>
          <Stack divider={<StackDivider />} spacing={4}>
            {question.map((comment) => (
              <Flex
                gap={3}
                key={comment.id}
                isProcessing={isProcessing}
                setIsProcessing={setIsprocessing}
              >
                <input
                  value={comment.userId === 30 ? "관리자" : comment.userId}
                />
                <Input value={comment.content} />
                <Input value={comment.inserted} />
              </Flex>
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
}
