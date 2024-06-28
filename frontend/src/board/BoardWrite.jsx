import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  IconButton,
  Input,
  List,
  ListItem,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "../component/CustomToast.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { DeleteIcon } from "@chakra-ui/icons";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { successToast, errorToast } = CustomToast();
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  useEffect(() => {
    if (account.isLoggedIn(account.id)) {
      setUserId(account.id);
    }
  }, [account]);

  function handleClickButton() {
    setIsLoading(true);
    axios
      .postForm("/api/board/add", {
        title,
        userId,
        content,
        files,
      })
      .then(() => {
        successToast("게시물 작성이 완료되었습니다");
        navigate("/board/list");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          errorToast("게시물 작성에 실패했습니다. 다시 작성해주세요");
        }
      })
      .finally(() => setIsLoading(false));
  }

  let disableSaveButton = false;
  if (title.length === 0) {
    disableSaveButton = true;
  }
  if (content.length === 0) {
    disableSaveButton = true;
  }

  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(
      <Flex key={i}>
        <ListItem display="flex" alignItems="center">
          <Text flex="1">{files[i].name}</Text>
        </ListItem>
        <IconButton
          aria-label="Remove"
          icon={<DeleteIcon />}
          onClick={() => {
            const newFiles = Array.from(files);
            newFiles.splice(i, 1);
            setFiles(newFiles);
          }}
          ml={3}
        />
      </Flex>,
    );
  }

  return (
    <Box>
      <Heading>자유게시판 글 작성</Heading>
      <Box mt={"30px"}>
        <FormControl>
          <Heading fontSize={"md"}>제목</Heading>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            placeholder={"제목을 입력해주세요"}
            mt={"20px"}
          />
        </FormControl>
      </Box>
      <Box mt={"20px"}>
        <FormControl>
          {fileNameList.length > 0 && (
            <Box mt={"5px"}>
              <Heading fontSize="md" mb={"10px"}>
                선택된 파일 목록
              </Heading>
              <List spacing={3}>{fileNameList}</List>
            </Box>
          )}
          <Flex justifyContent="center">
            <Heading fontSize={"md"} mt={"10px"}>
              상품 상세 내용
            </Heading>
            <Spacer />
            <FormHelperText mb={"13px"} mr={3}>
              총 용량은 10MB를 초과할 수 없습니다
            </FormHelperText>
            <Button mb={"5px"} onClick={() => fileInputRef.current.click()}>
              파일첨부
            </Button>
            <Input
              multiple
              type={"file"}
              ref={fileInputRef}
              display={"none"}
              accept={"image/*"}
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
          </Flex>
          <Textarea
            onChange={(e) => setContent(e.target.value)}
            placeholder={"내용을 입력해주세요"}
            mt={"5px"}
            rows={10}
          />
        </FormControl>
      </Box>
      <Box>
        <Input type={"hidden"} value={account.id} />
      </Box>
      <Box>
        <Button
          isLoading={isLoading}
          isDisabled={disableSaveButton}
          onClick={handleClickButton}
          mt={"20px"}
        >
          게시글 생성
        </Button>
      </Box>
    </Box>
  );
}
