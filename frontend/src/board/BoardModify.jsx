import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Spacer,
  Spinner,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CustomToast } from "../component/CustomToast.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { DeleteIcon } from "@chakra-ui/icons";

export function BoardModify() {
  const [board, setBoard] = useState(null);
  const [boardLike, setBoardLike] = useState({ boardLike: false, count: 0 });
  const [removeFileList, setRemoveFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const { successToast, errorToast } = CustomToast();
  const { board_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/${board_id}`).then((res) => {
      setBoard(res.data.board);
      setBoardLike(res.data.boardLike);
    });
  }, []);

  function handleClickSaveButton() {
    axios
      .putForm(`/api/board/modify`, {
        id: board.id,
        title: board.title,
        content: board.content,
        boardLike,
        removeFileList,
        addFileList,
      })
      .then(() => {
        successToast("게시물 수정이 완료되었습니다");
        navigate("/board/list");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("게시물 수정에 실패했습니다. 다시 수정해주세요");
        }
      });
  }

  if (board === null) {
    return <Spinner />;
  }

  function handleClickDeleteButton() {
    axios
      .delete(`/api/board/${board_id}`)
      .then(() => {
        successToast("게시물이 삭제되었습니다");
        navigate("/board/list");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("게시물 삭제에 실패했습니다. 다시 삭제해주세요");
        }
      });
  }

  function handleRemoveSwitchChange(fileName, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, fileName]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== fileName));
    }
  }

  const fileNameList = [];
  for (let i = 0; i < addFileList.length; i++) {
    let duplicate = false;
    for (let file of board.boardFileList) {
      if (file.name === addFileList.name) {
        duplicate = true;
        break;
      }
    }
    fileNameList.push(
      <Flex key={i}>
        <ListItem display="flex" alignItems="center">
          <Text flex="1">{addFileList[i].name}</Text>
          {duplicate && <Badge colorScheme={"yellow"}>중복된 파일</Badge>}
        </ListItem>
        <IconButton
          aria-label="Remove"
          icon={<DeleteIcon />}
          onClick={() => {
            const newFiles = Array.from(addFileList);
            newFiles.splice(i, 1);
            setAddFileList(newFiles);
          }}
        />
      </Flex>,
    );
  }

  return (
    <Box>
      <Heading>자유게시판 글 수정</Heading>
      <Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
            defaultValue={board.title}
          />
        </FormControl>
      </Box>
      <Flex>
        {board.boardFileList &&
          board.boardFileList.map((file, index) => (
            <Card m={3} key={index} w={"400px"}>
              <CardBody>
                <Image src={file.filePath} sizes={"100%"} />
              </CardBody>
              <CardFooter>
                <Flex>
                  <Box mr={3}>
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Box>
                  <Box mr={1}>
                    <Switch
                      onChange={(e) =>
                        handleRemoveSwitchChange(
                          file.fileName,
                          e.target.checked,
                        )
                      }
                    />
                  </Box>
                  <Box>
                    <Text>{file.fileName}</Text>
                  </Box>
                </Flex>
              </CardFooter>
            </Card>
          ))}
      </Flex>
      <Box>
        <FormControl>
          <Flex>
            <FormLabel>상품 상세 내용</FormLabel>
            <Spacer />
            <Input
              multiple
              type={"file"}
              accept={"image/*"}
              onChange={(e) => {
                setAddFileList(e.target.files);
              }}
            />
          </Flex>
          {addFileList.length > 0 && (
            <Box mt={2}>
              <Heading size="md" mb={2}>
                선택된 파일 목록
              </Heading>
              <List spacing={2}>{fileNameList}</List>
            </Box>
          )}
          <Textarea
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
            defaultValue={board.content}
          />
        </FormControl>
      </Box>
      <Box>
        <Button onClick={handleClickSaveButton}>게시글 수정</Button>
      </Box>
      <Box>
        <Button onClick={handleClickDeleteButton}>게시글 삭제</Button>
      </Box>
    </Box>
  );
}
