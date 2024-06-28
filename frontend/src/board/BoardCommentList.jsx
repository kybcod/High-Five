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
  Stack,
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
import { BoardReCommentEdit } from "./BoardReCommentEdit.jsx";
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
    return `${depth * 25}px`;
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
                  <Flex>
                    {boardComment.profileImage.fileName == null && (
                      <Image
                        borderRadius="full"
                        boxSize="35px"
                        fallbackSrc="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800"
                        src={boardComment.profileImage.src}
                        alt="Default Profile Image"
                        onClick={() =>
                          navigate(`/myPage/${boardComment.userId}/shop`)
                        }
                        cursor={"pointer"}
                      />
                    )}
                    {boardComment.profileImage.fileName != null && (
                      <Image
                        borderRadius="full"
                        boxSize="35px"
                        src={boardComment.profileImage.src}
                        alt="Profile Image"
                        onClick={() =>
                          navigate(`/myPage/${boardComment.userId}/shop`)
                        }
                        cursor={"pointer"}
                      />
                    )}
                    <Text ml={"10px"}>{boardComment.nickName}</Text>
                    <Spacer />
                    {account.hasAccess(boardComment.userId) && (
                      <Menu>
                        <MenuButton>
                          <FontAwesomeIcon
                            icon={faEllipsisVertical}
                            size={"lg"}
                          />
                        </MenuButton>
                        <MenuList>
                          <MenuItem
                            onClick={() => handleEditClick(boardComment.id)}
                          >
                            수정
                          </MenuItem>
                          <MenuItem
                            onClick={() =>
                              handleClickCommentDelete(boardComment.id)
                            }
                          >
                            삭제
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
                  </Flex>
                  {isEditingId === boardComment.id || (
                    <Flex mt={"10px"}>
                      <Textarea
                        defaultValue={boardComment.content}
                        resize={"none"}
                        readOnly
                      />
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
                          fontSize={"small"}
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
                    mt={3}
                  >
                    <Flex alignItems={"center"}>
                      {subComment.profileImage.fileName == null && (
                        <Image
                          borderRadius="full"
                          boxSize="35px"
                          fallbackSrc="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800"
                          src={subComment.profileImage.src}
                          alt="Default Profile Image"
                          onClick={() =>
                            navigate(`/myPage/${subComment.userId}/shop`)
                          }
                          cursor={"pointer"}
                        />
                      )}
                      {subComment.profileImage.fileName != null && (
                        <Image
                          borderRadius="full"
                          boxSize="35px"
                          src={subComment.profileImage.src}
                          alt="Profile Image"
                          onClick={() =>
                            navigate(`/myPage/${subComment.userId}/shop`)
                          }
                          cursor={"pointer"}
                        />
                      )}
                      <Text ml={"10px"} fontWeight={"md"}>
                        {subComment.nickName}
                      </Text>
                      <Spacer />
                      {account.hasAccess(subComment.userId) && (
                        <Menu>
                          <MenuButton>
                            <FontAwesomeIcon
                              icon={faEllipsisVertical}
                              size={"lg"}
                            />
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={() => handleEditClick(subComment.id)}
                            >
                              수정
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleClickCommentDelete(subComment.id)
                              }
                            >
                              삭제
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      )}
                    </Flex>
                    {isEditingId === subComment.id || (
                      <Flex mt={"10px"}>
                        <Textarea
                          defaultValue={subComment.content}
                          readOnly
                          size="sm"
                          resize={"none"}
                        />
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
                            fontSize={"small"}
                            mt={2}
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
