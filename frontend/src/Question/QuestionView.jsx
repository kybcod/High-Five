import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CommentComponent } from "./CommentComponent.jsx";
import { DeleteIcon, EditIcon, Icon } from "@chakra-ui/icons";
import { QuestionList } from "./QuestionList.jsx";

export function QuestionView() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const account = useContext(LoginContext);
  // const [isNewBadge, setIsNewBadge] = useState("");

  useEffect(() => {
    axios
      .get(`/api/question/${id}`)
      .then((res) => {
        setQuestion(res.data);
        // setIsNewBadge(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "해당 게시글이 없습니다",
            position: "top",
            duration: 2500,
          });
          // navigate("/question/list");
        }
      });
  }, [id]);

  function handleRemoveClick() {
    axios
      .delete(`/api/question/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 게시물이 삭제되었습니다.`,
          position: "top",
          duration: 2500,
        });
        navigate("/question/list");
      })
      .catch((res) => {
        if (res.response.status === 403) {
          toast({
            status: "error",
            description: `권한이 없는 사용자입니다`,
            position: "top",
            duration: 2500,
          });
        } else {
          toast({
            status: "error",
            description: `${id}번 게시물 삭제 중 오류가 발생하였습니다.`,
            position: "top",
            duration: 2500,
          });
        }
      });
  }

  if (question === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box mt={2}>
        <Text value={question.id} />
      </Box>

      {account.hasAccess(question.userId) && (
        <Box>
          <Flex justify={"flex-end"} mr={10} mt={5} gap={8}>
            <EditIcon
              w={8}
              h={8}
              color="blue.500"
              onClick={() => navigate(`/question/edit/${id}`)}
            />
            <DeleteIcon w={8} h={8} color="red.500" onClick={onOpen} />
          </Flex>
        </Box>
      )}

      <Box mt={2}>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={question.title} readOnly></Input>
        </FormControl>
      </Box>

      <Box mt={2}>
        <Flex justify={"space-between"}>
          <Box w="10%">작성자</Box>
          <Input w="30%" value={question.nickName} readOnly />
          <Box w="10%">작성시간</Box>
          <Input w="30%" value={question.insertedAll} readOnly />
          <Box>
            {question.isNewBadge && <Badge colorScheme="green">New</Badge>}
          </Box>
        </Flex>
      </Box>

      <Box>
        <Box mt={5}>
          <FormControl>
            <FormLabel>문의 상세내용</FormLabel>
          </FormControl>
        </Box>
        <Box mt={4}>
          <Textarea value={question.content} readOnly></Textarea>
        </Box>

        <Box>
          <Box mt={5}>
            {question.fileList &&
              question.fileList.map((file) => (
                <Card m={3} key={file.name}>
                  <CardBody>
                    <Image w={"600px"} src={file.src} />
                  </CardBody>
                </Card>
              ))}
          </Box>
        </Box>

        {/*댓글 컴포넌트*/}
        <CommentComponent questionId={question.id} />

        <Center m={10}>
          <Button
            colorScheme={"teal"}
            w={"200px"}
            onClick={() => navigate("/question/list")}
          >
            글 목록
          </Button>
        </Center>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={onClose}>취소</Button>
              <Button onClick={handleRemoveClick} colorScheme={"red"}>
                확인
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
