import { Box, Card, CardBody, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function BoardCommentList({ boardId, isProcessing, setIsProcessing }) {
  const [boardCommentList, setBoardCommentList] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      axios
        //.get(`/api/board/comment/${board_id}`)
        .get(`/api/board/comment/${boardId}`)
        .then((res) => setBoardCommentList(res.data))
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [isProcessing]);

  return (
    <Card>
      {boardCommentList &&
        boardCommentList.length > 0 &&
        boardCommentList.map((boardComment) => (
          <CardBody key={boardComment.id}>
            <Box>
              <Flex
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              >
                <Text>{boardComment.userId}</Text>
                <Input defaultValue={boardComment.content} readOnly />
              </Flex>
              <Text>{boardComment.inserted}</Text>
            </Box>
          </CardBody>
        ))}
    </Card>
  );
}
