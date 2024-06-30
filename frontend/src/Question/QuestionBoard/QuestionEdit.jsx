import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Spinner,
  Stack,
  StackDivider,
  Switch,
  Table,
  Td,
  Text,
  Textarea,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { CustomToast } from "../../component/CustomToast.jsx";

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
        secretWrite: question.secretWrite,
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

  function handleChangeFiles(e) {
    const newSelectedFiles = Array.from(e.target.files);
    const newPreviews = newSelectedFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setAddFileList(newSelectedFiles); // 새로 선택한 파일들로 덮어쓰기
    setNewFilePreviews(newPreviews); // 새로운 미리보기로 덮어쓰기
  }

  function handleRemoveSwitch(name, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, name]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== name));
    }
  }

  return (
    <>
      <Text
        mx="auto"
        maxWidth="1000px"
        fontSize={"2xl"}
        fontWeight={"bold"}
        mb={4}
      >
        1:1 문의 글 수정
      </Text>
      <Divider border={"1px solid black"} mx="auto" maxWidth="1000px" my={4} />

      <Box maxWidth="1000px" mx="auto" position="relative">
        <Table align={"center"} fontSize={"15px"}>
          <Tr>
            <Td w={"15%"} fontWeight={700}>
              옵션
            </Td>
            <Td>
              <Checkbox
                mr={2}
                onChange={(e) =>
                  setQuestion({ ...question, secretWrite: e.target.checked })
                }
                isChecked={question.secretWrite}
              />
              비밀글
            </Td>
          </Tr>
          <Tr colspan>
            <Td w={"15%"} fontWeight={700}>
              작성자
            </Td>
            <Td>{question.nickName}</Td>
          </Tr>
          <Tr>
            <Td w={"15%"} fontWeight={700}>
              제목
            </Td>
            <Td>
              <Input
                defaultValue={question.title}
                onChange={(e) =>
                  setQuestion({ ...question, title: e.target.value })
                }
              />
            </Td>
          </Tr>
          <Tr>
            <Td w={"15%"} fontWeight={700}>
              내용
            </Td>
            <Td>
              <Textarea
                defaultValue={question.content}
                onChange={(e) =>
                  setQuestion({ ...question, content: e.target.value })
                }
                placeholder="내용을 입력해주세요"
                maxLength="5000"
                rows={"10"}
                resize={"none"}
              />
            </Td>
          </Tr>
          <Tr>
            <Td w={"15%"} fontWeight={700}>
              파일 첨부
            </Td>
            <Td>
              <Box
                m={7}
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                gap={2}
                justifyContent="space-between"
              >
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
                          w={"320px"}
                        />
                      </CardBody>
                    </Card>
                  ))}
              </Box>

              <Box
                m={7}
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                gap={2}
                justifyContent="space-between"
              >
                {newFilePreviews.map((src, index) => (
                  <Card m={1} key={index}>
                    <CardFooter>
                      <Flex gap={3}>
                        <Text>{addFileList[index].name}</Text>
                      </Flex>
                    </CardFooter>
                    <CardBody>
                      <Image src={src} boxSize={"320px"} />
                    </CardBody>
                  </Card>
                ))}
              </Box>
              <FormControl mb={5}>
                <Input
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={handleChangeFiles}
                />
                <FormHelperText>
                  이미지 파일만 업로드할 수 있습니다.
                  <br />한 파일당 1MB를 초과할 수 없으며 총 용량은 10MB입니다.
                </FormHelperText>
              </FormControl>
            </Td>
          </Tr>
        </Table>

        <Flex justify={"flex-end"} mt={5} gap={4} mb={20}>
          <Button
            colorScheme={"teal"}
            w={120}
            variant={"outline"}
            borderRadius={"unset"}
            onClick={handleEditClick}
          >
            수정
          </Button>
          <Button
            colorScheme={"teal"}
            w={120}
            variant={"outline"}
            borderRadius={"unset"}
            onClick={() => {
              navigate(-1);
            }}
          >
            취소
          </Button>
        </Flex>
      </Box>
    </>
  );
}
