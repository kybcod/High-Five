import {
  Box,
  Card,
  CardBody,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CustomToast } from "../component/CustomToast.jsx";
import { useNavigate } from "react-router-dom";
import { BoardCommentEdit } from "./BoardCommentEdit.jsx";
import { BoardReCommentWrite } from "./BoardReCommentWrite.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

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
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, [isProcessing, boardId]);

  function buildCommentTree(comments) {
    const map = new Map();
    const tree = [];

    comments.forEach((comment) => {
      comment.replies = [];
      map.set(comment.id, comment);
      if (comment.refId === 0) {
        tree.push(comment);
      } else {
        const parent = map.get(comment.refId);
        if (parent) {
          parent.replies.push(comment);
        }
      }
    });

    return tree;
  }

  function handleClickCommentDelete(commentId) {
    setIsProcessing(true);
    axios
      .delete(`/api/board/comment/${commentId}`)
      .then((res) => {
        successToast(`댓글이 삭제되었습니다`);
        setBoardCommentList(buildCommentTree(res.data));
        navigate(`/board/${boardId}`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("게시물 삭제에 실패했습니다. 다시 시도해주세요");
        }
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
          {(() => {
            const renderComments = (comments, depth = 0) => {
              return comments.map((comment) => (
                <Box
                  key={comment.id}
                  style={{ marginLeft: measureDepth(depth) }}
                >
                  <Flex>
                    {comment.profileImage.fileName == null && (
                      <Image
                        borderRadius="full"
                        boxSize="35px"
                        fallbackSrc="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800"
                        src={comment.profileImage.src}
                        alt="Default Profile Image"
                        onClick={() =>
                          navigate(`/myPage/${comment.userId}/shop`)
                        }
                        cursor={"pointer"}
                      />
                    )}
                    {comment.profileImage.fileName != null && (
                      <Image
                        borderRadius="full"
                        boxSize="35px"
                        src={comment.profileImage.src}
                        alt="Profile Image"
                        onClick={() =>
                          navigate(`/myPage/${comment.userId}/shop`)
                        }
                        cursor={"pointer"}
                      />
                    )}
                    <Text ml={"10px"}>{comment.nickName}</Text>
                    <Spacer />
                    {account.hasAccess(comment.userId) &&
                      account.isLoggedIn(comment.userId) && (
                        <Menu>
                          <MenuButton>
                            <FontAwesomeIcon
                              icon={faEllipsisVertical}
                              size={"lg"}
                            />
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() => handleEditClick(comment.id)}
                            >
                              수정
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleClickCommentDelete(comment.id)
                              }
                            >
                              삭제
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      )}
                  </Flex>
                  {isEditingId === comment.id || (
                    <Flex mt={"10px"}>
                      <Textarea
                        defaultValue={comment.content}
                        resize={"none"}
                        readOnly
                      />
                    </Flex>
                  )}
                  {isEditingId === comment.id && (
                    <BoardCommentEdit
                      boardComment={comment}
                      setIsEditingId={setIsEditingId}
                      updatedContent={updatedContent}
                      setUpdatedContent={setUpdatedContent}
                      setIsProcessing={setIsProcessing}
                    />
                  )}
                  <Flex>
                    {showReCommentId === comment.id || (
                      <Box>
                        <Text
                          onClick={() => handleClickReComment(comment.id)}
                          fontSize={"small"}
                        >
                          답글쓰기
                        </Text>
                      </Box>
                    )}
                    <Spacer />
                    <Box>
                      <Text>{comment.inserted}</Text>
                    </Box>
                  </Flex>
                  <Box>
                    {showReCommentId === comment.id && (
                      <BoardReCommentWrite
                        boardComment={comment}
                        setShowReCommentId={setShowReCommentId}
                        setIsProcessing={setIsProcessing}
                        refId={comment.id}
                      />
                    )}
                  </Box>
                  {comment.replies &&
                    renderComments(comment.replies, depth + 1)}
                </Box>
              ));
            };

            const commentTree = buildCommentTree(boardCommentList);

            return renderComments(commentTree);
          })()}
        </CardBody>
      </Card>
    )
  );
}
