import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { useNavigate } from "react-router-dom";
import { BoardCommentEdit } from "./BoardCommentEdit.jsx";
import { BoardReCommentWrite } from "./BoardReCommentWrite.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { BoardReCommentEdit } from "./BoardReCommentEdit.jsx";

export function BoardCommentList({ boardId, isProcessing, setIsProcessing }) {
  const [boardCommentList, setBoardCommentList] = useState([]);
  const [isEditingId, setIsEditingId] = useState(null);
  const [updatedContent, setUpdatedContent] = useState("");
  const [showReCommentId, setShowReCommentId] = useState(null);
  const { successToast, errorToast } = CustomToast();
  const account = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isProcessing) {
      axios
        .get(`/api/board/comment/${boardId}`)
        .then((res) => {
          setBoardCommentList(res.data);
          setUpdatedContent(updatedContent);
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
    setIsProcessing(true);
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
  }

  function handleEditClick(id) {
    setIsEditingId(id);
    setUpdatedContent("");
  }

  function handleClickReComment(id) {
    setShowReCommentId(id);
  }

  function handleClickReReComment(id) {
    setShowReCommentId(id);
  }

  const measureDepth = (depth) => {
    return `${depth * 10}px`;
  };

  return (
    boardCommentList &&
    boardCommentList.length > 0 && (
      <Card
        borderWidth="1px"
        borderStyle="solid"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow={"none"}
        mt={"20px"}
      >
        <CardBody>
          {boardCommentList.map((boardComment) => (
            <Stack key={boardComment.id}>
              {boardComment.refId === 0 && (
                <Box>
                  {isEditingId === boardComment.id || (
                    <Flex>
                      <Text>{boardComment.nickName}</Text>
                      <Textarea
                        defaultValue={boardComment.content}
                        resize={"none"}
                        readOnly
                      />
                      {account.hasAccess(boardComment.userId) && (
                        <Stack>
                          <Button
                            onClick={() =>
                              handleClickCommentDelete(boardComment.id)
                            }
                          >
                            삭제
                          </Button>
                          <Button
                            onClick={() => handleEditClick(boardComment.id)}
                          >
                            수정
                          </Button>
                        </Stack>
                      )}
                    </Flex>
                  )}
                  {isEditingId === boardComment.id && (
                    <BoardCommentEdit
                      boardComment={boardComment}
                      setIsEditingId={setIsEditingId}
                      updatedContent={updatedContent}
                      setUpdatedContent={setUpdatedContent}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  <Flex>
                    {showReCommentId === boardComment.id || (
                      <Box>
                        <Text
                          onClick={() => handleClickReComment(boardComment.id)}
                          fontSize={"12px"}
                        >
                          답글쓰기
                        </Text>
                      </Box>
                    )}
                    <Spacer />
                    <Box>
                      <Text>{boardComment.inserted}</Text>
                    </Box>
                  </Flex>
                  <Box>
                    {showReCommentId === boardComment.id && (
                      <BoardReCommentWrite
                        boardComment={boardComment}
                        setShowReCommentId={setShowReCommentId}
                        setIsProcessing={setIsProcessing}
                        refId={boardComment.id}
                      />
                    )}
                  </Box>
                </Box>
              )}
              {boardCommentList
                .filter((subComment) => subComment.refId === boardComment.id)
                .map((subComment) => (
                  <Box
                    key={subComment.commentSeq}
                    style={{ marginLeft: measureDepth(subComment.commentId) }}
                    width="90%"
                  >
                    {isEditingId === subComment.id || (
                      <Flex>
                        <Text>{subComment.nickName}</Text>
                        <Textarea
                          defaultValue={subComment.content}
                          readOnly
                          size="sm"
                          resize={"none"}
                        />
                        {account.hasAccess(subComment.userId) && (
                          <Stack>
                            <Button
                              onClick={() =>
                                handleClickCommentDelete(subComment.id)
                              }
                            >
                              삭제
                            </Button>
                            <Button
                              onClick={() => handleEditClick(subComment.id)}
                            >
                              수정
                            </Button>
                          </Stack>
                        )}
                      </Flex>
                    )}
                    {isEditingId === subComment.id && (
                      <BoardReCommentEdit
                        subComment={subComment}
                        setIsEditingId={setIsEditingId}
                        updatedContent={updatedContent}
                        setUpdatedContent={setUpdatedContent}
                        setIsProcessing={setIsProcessing}
                      />
                    )}
                    <Flex>
                      {showReCommentId === subComment.id || (
                        <Box>
                          <Text
                            onClick={() =>
                              handleClickReReComment(subComment.id)
                            }
                            fontSize={"12px"}
                          >
                            답글쓰기
                          </Text>
                        </Box>
                      )}
                      <Spacer />
                      <Box>
                        <Text>{subComment.inserted}</Text>
                      </Box>
                    </Flex>
                    <Box>
                      {showReCommentId === subComment.id && (
                        <BoardReCommentWrite
                          boardComment={subComment}
                          setShowReCommentId={setShowReCommentId}
                          setIsProcessing={setIsProcessing}
                          refId={subComment.refId}
                        />
                      )}
                    </Box>
                  </Box>
                ))}
            </Stack>
          ))}
        </CardBody>
      </Card>
    )
  );
}
