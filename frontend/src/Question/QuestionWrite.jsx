import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";

export function QuestionWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  function handleSaveClick() {
    setLoading(true);
    axios
      .postForm("/api/question", {
        title,
        content,
        files,
      })
      .then(() => {
        toast({
          description: "새 글이 등록되었습니다.",
          status: "success",
          position: "bottom",
          duration: 2000,
        });
        navigate("/question/list");
      })
      .catch((e) => {
        const code = e.response.status;
        if (code === 400) {
          toast({
            description: "등록되지 않았습니다. 내용을 확인해 주세요.",
            status: "error",
            position: "bottom",
            duration: 2500,
          });
        }
        if (code === 413) {
          toast({
            description: "파일 크기가 허용된 용량을 초과하였습니다.",
            status: "error",
            position: "top",
            duration: 3000,
          });
        }
      })
      .finally(() => setLoading(false));
  }

  let isDisableSaveButton = false;
  if (title.trim().length === 0 || content.trim().length === 0) {
    isDisableSaveButton = true;
  }

  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(
      <Box>
        <Text fontSize={"md"}>{files[i].name}</Text>
      </Box>,
    );
  }

  return (
    <Box>
      <Box mt={5}>
        <Heading>문의 글 작성</Heading>
      </Box>

      <Box mt={2}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="내용을 입력해주세요"
          ></Input>
        </FormControl>
      </Box>

      <Box mt={5}>
        <FormControl>
          <FormLabel>문의 상세내용</FormLabel>
          <Textarea
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력해주세요"
          ></Textarea>
        </FormControl>
      </Box>

      <Box mb={7}>
        <FormControl>
          <FormLabel>파일</FormLabel>
          <Input
            multiple
            type="file"
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
          <FormHelperText>
            이미지 파일만 업로드할 수 있습니다.
            <br />총 용량은 10MB이며, 한 파일은 1MB를 초과할 수 없습니다.
          </FormHelperText>
        </FormControl>
      </Box>
      {fileNameList.length > 0 && (
        <Box mb={7}>
          <Card>
            <CardHeader>
              <Heading size="md">선택된 파일 목록</Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing={4}>
                {fileNameList}
              </Stack>
            </CardBody>
          </Card>
        </Box>
      )}

      <Center>
        <Button
          onClick={handleSaveClick}
          isLoading={loading}
          isDisabled={isDisableSaveButton}
          colorScheme={"blue"}
          mt={3}
          w={500}
        >
          저장하기
        </Button>
      </Center>
    </Box>
  );
}
