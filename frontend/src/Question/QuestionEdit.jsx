import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Switch,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function QuestionEdit() {
  const [question, setQuestion] = useState({});
  const [removeFileList, setRemoveFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios.get(`/api/question/${id}`).then((res) => setQuestion(res.data));
  }, [id]);

  function handleEditClick() {
    axios
      .putForm(`/api/question/${id}`, {
        title: question.title,
        content: question.content,
        addFileList,
        removeFileList,
      })
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 게시물이 수정되었습니다.`,
          position: "bottom",
          duration: 2000,
        });
        navigate(`/question/list`);
      })
      .catch(() => {
        toast({
          status: "error",
          description: `게시물이 수정되지 않았습니다. 작성한 내용을 확인해주세요.`,
          position: "bottom",
          duration: 2500,
        });
      })
      .finally(() => {});
  }

  if (question === null) {
    return <Spinner />;
  }

  function handleRemoveSwitch(name, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, name]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== name));
    }
  }

  return (
    <Box>
      <Box m={7}>
        <Heading>{id}번 문의 글 수정</Heading>
      </Box>
      <Box>
        <Box m={7}>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input
              defaultValue={question.title}
              onChange={(e) =>
                setQuestion({ ...question, title: e.target.value })
              }
            ></Input>
          </FormControl>
        </Box>

        <Box m={7}>
          <Flex justify={"space-between"}>
            <Box w="10%">작성자</Box>
            <Input w="35%" value={question.nickName} readOnly />
            <Box w="10%">작성시간</Box>
            <Input w="35%" value={question.inserted} readOnly />
          </Flex>
        </Box>

        <Box m={7}>
          <FormControl>
            <FormLabel>문의 상세내용</FormLabel>
            <Textarea
              defaultValue={question.content}
              onChange={(e) =>
                setQuestion({ ...question, content: e.target.value })
              }
            ></Textarea>
          </FormControl>
        </Box>

        <Box m={7}>
          {Array.isArray(question.fileList) &&
            question.fileList.map((file) => (
              <Card m={1} key={file.name}>
                <CardFooter>
                  <Flex gap={3}>
                    <Box>
                      <FontAwesomeIcon color={"red"} icon={faTrashCan} />
                    </Box>
                    <Switch
                      colorScheme={"pink"}
                      onChange={(e) =>
                        handleRemoveSwitch(file.name, e.target.checked)
                      }
                    />
                    <Text>{file.name}</Text>
                  </Flex>
                </CardFooter>
                <CardBody>
                  <Image
                    src={file.src}
                    sx={
                      removeFileList.includes(file.name)
                        ? { filter: "blur(8px)" }
                        : {}
                    }
                  />
                </CardBody>
              </Card>
            ))}
        </Box>
        <Box m={7}>
          <FormControl>
            <Input
              type={"file"}
              accept={"image/*"}
              multiple
              onChange={(e) =>
                setQuestion({ ...question, fileList: e.target.files })
              }
            />
            <FormHelperText>
              이미지 파일만 업로드할 수 있습니다.
              <br />총 용량은 10MB이며, 한 파일은 1MB를 초과할 수 없습니다.
            </FormHelperText>
          </FormControl>
        </Box>
      </Box>
      <Flex justify={"flex-end"} mr={10} mt={5} gap={4} mb={20}>
        <Button w={"150px"} colorScheme={"blue"} onClick={handleEditClick}>
          수정
        </Button>
        <Button
          w={"150px"}
          onClick={() => {
            navigate(-1);
          }}
        >
          취소
        </Button>
      </Flex>
    </Box>
  );
}
