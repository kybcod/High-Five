import {
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
  const [board, setBoard] = useState({
    id: "",
    title: "",
    content: "",
  });
  const [removeFileList, setRemoveFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const [addFiles, setAddFiles] = useState([]);
  const { successToast, errorToast } = CustomToast();
  const { board_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/board/${board_id}`).then((res) => {
      setBoard(res.data);
    });
  }, []);

  function handleClickSaveButton() {
    axios
      .putForm(`/api/board/modify`, {
        id: board.id,
        title: board.title,
        content: board.content,
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

  const addFileNameList = [];
  for (let i = 0; i < addFiles.length; i++) {
    addFileNameList.push(
      <Box key={i}>
        <ListItem display="flex" alignItems="center">
          <Text flex="1">{addFiles[i].name}</Text>
        </ListItem>
        <IconButton
          aria-label="Remove"
          icon={<DeleteIcon />}
          onClick={() => {
            const newFiles = Array.from(addFiles);
            newFiles.splice(i, 1);
            setAddFiles(newFiles);
          }}
        />
      </Box>,
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
            value={board.title}
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
              <List spacing={2}>{addFileNameList}</List>
            </Box>
          )}
          <Textarea
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
            value={board.content}
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
