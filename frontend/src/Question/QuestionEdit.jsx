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
import { CustomToast } from "../component/CustomToast.jsx";

export function QuestionEdit() {
  const [question, setQuestion] = useState({});
  const [removeFileList, setRemoveFileList] = useState([]);
  const [newFilePreviews, setNewFilePreviews] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { successToast, errorToast } = CustomToast();

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
        successToast(`${id}번 게시물이 수정되었습니다.`);
        navigate(`/question/${id}`);
      })
      .catch((err) => {
        err.response.status === 413
          ? errorToast("파일 크기가 허용된 용량을 초과하였습니다.")
          : err.response.status === 403
            ? errorToast("권한이 없는 사용자입니다.")
            : errorToast("등록되지 않았습니다. 내용을 확인해 주세요");
      })
      .finally(() => {});
  }

  if (question === null) {
    return <Spinner />;
  }

  // setQuestion({ ...question, fileList: e.target.files }
  function handleChangeFiles(e) {
    const newSelectedFiles = Array.from(e.target.files);
    setAddFileList([...addFileList, ...newSelectedFiles]);
    const newPreviews = newSelectedFiles.map((file) =>
      URL.createObjectURL(file),
    );
    setNewFilePreviews([...newFilePreviews, ...newPreviews]);
  }

  function handleRemoveSwitch(name, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, name]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== name));
    }
  }

  // const fileNameList = [];
  // for (let addFile of addFileList) {
  //   fileNameList.push(
  //     <Flex>
  //       <Text fontSize={"md"} mr={3}>
  //         {addFile.name}
  //       </Text>
  //       <Box></Box>
  //     </Flex>,
  //   );
  // }

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
            <Input w="35%" value={question.insertedAll} readOnly />
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
                    <Box>
                      <Switch
                        colorScheme={"pink"}
                        onChange={(e) =>
                          handleRemoveSwitch(file.name, e.target.checked)
                        }
                      />
                    </Box>
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
                    w={"600px"}
                  />
                </CardBody>
              </Card>
            ))}
        </Box>

        <Box m={7}>
          {newFilePreviews.map((src, index) => (
            <Card m={1} key={index}>
              <CardFooter>
                <Flex gap={3}>
                  <Text>{addFileList[index].name}</Text>
                </Flex>
              </CardFooter>
              <CardBody>
                <Image src={src} w={"600px"} />
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
              onChange={handleChangeFiles}
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
