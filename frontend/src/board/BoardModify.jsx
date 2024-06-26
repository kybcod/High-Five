import {
  Badge,
  Box,
  Button,
  Card,
  CardFooter,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
  Switch,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
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
  const fileInputRef = useRef(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
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
        navigate(`/board/${board_id}`);
      })
      .catch((err) => {
        if (err) {
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
    console.log(fileName);
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
      if (file.fileName === addFileList[i].name) {
        duplicate = true;
        break;
      }
    }
    const displayName =
      addFileList[i].name.length > 15
        ? `${addFileList[i].name.slice(0, 15)}...`
        : addFileList[i].name;
    fileNameList.push(
      <HStack key={i}>
        <ListItem alignItems={"center"} display={"flex"}>
          <Text flex={1}>{displayName}</Text>
          {duplicate && (
            <Badge colorScheme={"yellow"} ml={"20px"}>
              중복된 파일
            </Badge>
          )}
        </ListItem>
        <IconButton
          aria-label="Remove"
          icon={<DeleteIcon />}
          onClick={() => {
            const newFiles = Array.from(addFileList);
            newFiles.splice(i, 1);
            setAddFileList(newFiles);
          }}
          ml={3}
        />
      </HStack>,
    );
  }

  return (
    <Box>
      <Heading>자유게시판 글 수정</Heading>
      <Box mt={"30px"}>
        <FormControl>
          <Heading fontSize={"md"}>제목</Heading>
          <Input
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
            defaultValue={board.title}
            mt={"20px"}
          />
        </FormControl>
      </Box>
      <Box mt={"30px"}>
        <FormControl>
          {addFileList.length > 0 && (
            <Box mt={"10px"}>
              <Heading fontSize="md" mb={"10px"}>
                선택된 파일 목록
              </Heading>
              <List spacing={3}>{fileNameList}</List>
            </Box>
          )}
          <Flex justifyContent={"center"} mt={"10px"}>
            <Heading color={"black"} fontSize={"md"} mt={"10px"}>
              상품 상세 내용
            </Heading>
            <Spacer />
            <FormHelperText mt={"10px"} mr={3}>
              총 용량은 10MB를 초과할 수 없습니다
            </FormHelperText>
            <Button mb={"10px"} onClick={() => fileInputRef.current.click()}>
              파일첨부
            </Button>
            <Input
              multiple
              type={"file"}
              accept={"image/*"}
              display={"none"}
              ref={fileInputRef}
              onChange={(e) => {
                setAddFileList(e.target.files);
              }}
            />
          </Flex>
        </FormControl>
      </Box>
      <Box border={"1px"} color={"gray.200"} borderRadius={"md"}>
        <Flex flexWrap={"wrap"} justifyContent={"space-evenly"} p={"20px"}>
          {board.boardFileList &&
            board.boardFileList.map((file, index) => (
              <Card
                mt={"10px"}
                key={index}
                w={"calc(30% - 10px)"}
                boxShadow={"none"}
                border={"none"}
              >
                <Image
                  src={file.filePath}
                  w={"100%"}
                  h={"300px"}
                  sx={
                    removeFileList.includes(file.fileName)
                      ? { filter: "blur(8px)" }
                      : {}
                  }
                />
                <CardFooter>
                  <Flex alignItems={"center"}>
                    <FontAwesomeIcon icon={faTrashCan} />
                    <Switch
                      onChange={(e) =>
                        handleRemoveSwitchChange(
                          file.fileName,
                          e.target.checked,
                        )
                      }
                      ml={3}
                    />
                    <Text ml={1}>
                      {file.fileName.length > 10 &&
                        `${file.fileName.slice(0, 10)}...`}
                      {file.fileName.length < 10 && file.fileName}
                    </Text>
                  </Flex>
                </CardFooter>
              </Card>
            ))}
        </Flex>
        <Textarea
          onChange={(e) => setBoard({ ...board, content: e.target.value })}
          defaultValue={board.content}
          mt={"5px"}
          color={"black"}
          border={"transparent"}
          focusBorderColor={"transparent"}
          sx={{ outline: "none" }}
          resize={"none"}
        />
      </Box>
      <Box>
        <Button mt={"20px"} onClick={handleClickSaveButton}>
          게시글 수정
        </Button>
      </Box>
      <Box>
        <Button mt={"10px"} onClick={onOpen}>
          게시글 삭제
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>게시글 삭제</ModalHeader>
          <ModalBody>
            <Text>게시글을 삭제하시겠습니까?</Text>
          </ModalBody>
          <ModalFooter>
            <Flex>
              <Button onClick={onClose}>취소</Button>
              <Button onClick={handleClickDeleteButton} colorScheme={"red"}>
                삭제
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
