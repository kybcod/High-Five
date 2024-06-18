import { Box, Heading } from "@chakra-ui/react";
import { BoardCommentList } from "./BoardCommentList.jsx";
import { BoardCommentWrite } from "./BoardCommentWrite.jsx";
import { useState } from "react";

export function BoardCommentComponent({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box>
      <Box>
        <Heading>Comment</Heading>
      </Box>
      <Box>
        <BoardCommentWrite
          boardId={boardId}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
        <BoardCommentList
          boardId={boardId}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Box>
    </Box>
  );
}
