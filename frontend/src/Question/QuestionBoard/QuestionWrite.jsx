import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Image,
  Stack,
  StackDivider,
  Text,
  Textarea,
  Divider,
  Table,
  Tr,
  Td,
  Flex,
  CardFooter,
  Switch,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "../../component/CustomToast.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function QuestionWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = CustomToast();
  const [secretWrite, setSecretWrite] = useState(false);
  const [previewList, setPreviewList] = useState([]);
  const [removeFileList, setRemoveFileList] = useState([]);

  const navigate = useNavigate();

  function handleSaveClick() {
    setLoading(true);
    axios
      .postForm("/api/question", {
        title,
        content,
        files: files.filter((_, index) => !removeFileList.includes(index)),
        secretWrite,
      })
      .then(() => {
        successToast("게시글이 등록되었습니다");
        navigate("/question/list");
      })
      .catch((err) => {
        err.response.status === 413
          ? errorToast("파일 크기가 허용된 용량을 초과하였습니다.")
          : err.response.status === 403
            ? errorToast("권한이 없는 사용자입니다.")
            : errorToast("등록되지 않았습니다. 내용을 확인해 주세요");
      })
      .finally(() => setLoading(false));
  }

  let isDisableSaveButton = false;
  if (title.trim().length === 0 || content.trim().length === 0) {
    isDisableSaveButton = true;
  }

  function handleSecretWrite() {
    setSecretWrite(!secretWrite);
  }

  function handleInsertFiles(e) {
    const selectFiles = Array.from(e.target.files);
    setFiles([...files, ...selectFiles]);
    setPreviewList([
      ...previewList,
      ...selectFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }

  function handleRemoveFile(index) {
    if (removeFileList.includes(index)) {
      setRemoveFileList(removeFileList.filter((i) => i !== index));
    } else {
      setRemoveFileList([...removeFileList, index]);
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
        1:1 문의
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
                isChecked={secretWrite}
                onChange={handleSecretWrite}
              />
              비밀글
            </Td>
          </Tr>
          <Tr>
            <Td w={"15%"} fontWeight={700}>
              제목
            </Td>
            <Td>
              <Input
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요"
              />
            </Td>
          </Tr>
          <Tr>
            <Td w={"15%"} fontWeight={700}>
              내용
            </Td>
            <Td>
              <Textarea
                onChange={(e) => setContent(e.target.value)}
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
              <FormControl mb={5}>
                <Input
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={handleInsertFiles}
                />
                <FormHelperText>
                  이미지 파일만 업로드할 수 있습니다.
                  <br />한 파일당 1MB를 초과할 수 없으며 총 용량은 10MB입니다.
                </FormHelperText>
              </FormControl>
              {files.length > 0 && (
                <Box mb={7}>
                  <Card>
                    <CardHeader>
                      <Heading size="md">선택된 파일 목록</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box
                        display="flex"
                        flexWrap={"wrap"}
                        gap={5}
                        justifyContent={"space-around"}
                      >
                        {previewList.map((src, index) => (
                          <Card key={index} m={1}>
                            <CardFooter>
                              <Flex gap={3} alignItems="center">
                                <Box>
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    onClick={() => handleRemoveFile(index)}
                                  />
                                </Box>
                                <Box>
                                  <Switch
                                    colorScheme={"pink"}
                                    isChecked={removeFileList.includes(index)}
                                    onChange={() => handleRemoveFile(index)}
                                  />
                                </Box>
                                <Text>{files[index].name}</Text>
                              </Flex>
                            </CardFooter>
                            <CardBody>
                              <Image
                                src={src}
                                sx={
                                  removeFileList.includes(index)
                                    ? { filter: "blur(8px)" }
                                    : {}
                                }
                                w={"320px"}
                              />
                            </CardBody>
                          </Card>
                        ))}
                      </Box>
                    </CardBody>
                  </Card>
                </Box>
              )}
            </Td>
          </Tr>
        </Table>

        <Flex justify="flex-end" position="absolute" right="0" bottom="-60px">
          <Button
            onClick={handleSaveClick}
            isLoading={loading}
            isDisabled={isDisableSaveButton}
            colorScheme={"teal"}
            w={"100px"}
            variant={"outline"}
            borderRadius={"unset"}
          >
            저장하기
          </Button>
        </Flex>
      </Box>
    </>
  );
}
