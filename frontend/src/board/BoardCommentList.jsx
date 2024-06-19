import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { useNavigate } from "react-router-dom";
import { BoardCommentEdit } from "./BoardCommentEdit.jsx";

export function BoardCommentList({ boardId, isProcessing, setIsProcessing }) {
  const [boardCommentList, setBoardCommentList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState("");
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/board/comment/${boardId}`)
        .then((res) => {
          setBoardCommentList(res.data);
          navigate(`/board/${boardId}`);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [isProcessing]);

  function handleClickCommentDelete(commentId) {
    axios
      .delete(`/api/board/comment/${commentId}`)
      .then((res) => {
        successToast(`댓글이 삭제되었습니다`);
        setBoardCommentList(res.data);
        navigate(`/board/${boardId}`);
      })
      .catch(() => {
        errorToast(`댓글 삭제 권한이 없습니다`);
      })
      .finally(() => {
        setIsProcessing(false);
      });
    console.log(commentId);
  }

  return (
    <Card>
      <CardBody>
        {boardCommentList &&
          boardCommentList.length > 0 &&
          boardCommentList.map((boardComment) => (
            <Box key={boardComment.id}>
              {isEditing || (
                <Flex>
                  <Text>{boardComment.userId}</Text>
                  <Textarea defaultValue={boardComment.content} readOnly />
                  <Stack>
                    <Button
                      onClick={() => handleClickCommentDelete(boardComment.id)}
                    >
                      삭제
                    </Button>
                    <Button onClick={() => setIsEditing(true)}>수정</Button>
                  </Stack>
                </Flex>
              )}
              {isEditing && (
                <BoardCommentEdit
                  boardComment={boardComment}
                  setIsEditing={setIsEditing}
                  updatedContent={updatedContent}
                  setUpdatedContent={setUpdatedContent}
                />
              )}
              <Text>{boardComment.inserted}</Text>
            </Box>
          ))}
      </CardBody>
    </Card>
  );
}
