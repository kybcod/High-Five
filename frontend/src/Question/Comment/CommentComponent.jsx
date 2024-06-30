import { Box, Heading } from "@chakra-ui/react";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";
import React, { useState } from "react";

export function CommentComponent({ questionId }) {
  const [isProcessing, setIsProcessing] = useState(false);
  return (
    <Box>
      <Box mt={20}>
        <Heading>COMMENTS</Heading>
      </Box>
      <Box mt={10}>
        <CommentList
          questionId={questionId}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Box>
      <Box mt={10}>
        <CommentWrite
          questionId={questionId}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Box>
    </Box>
  );
}
