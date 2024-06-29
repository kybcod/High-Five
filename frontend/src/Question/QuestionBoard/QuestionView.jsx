import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { CommentComponent } from "../Comment/CommentComponent.jsx";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { CustomToast } from "../../component/CustomToast.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

export function QuestionView() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const account = useContext(LoginContext);
  const { successToast, errorToast } = CustomToast();

  useEffect(() => {
    axios
      .get(`/api/question/${id}`)
      .then((res) => {
        setQuestion(res.data);
      })
      .catch((err) => {
        err.response.status === 403
          ? errorToast("권한이 없는 사용자입니다")
          : errorToast("해당 게시글이 없습니다.");
        navigate("/question/list");
      });
  }, [id]);

  function handleRemoveClick() {
    axios
      .delete(`/api/question/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        successToast(`${id}번 게시물이 삭제되었습니다.`);
        navigate("/question/list");
      })
      .catch((err) => {
        err.response.status === 403
          ? errorToast("권한이 없는 사용자입니다")
          : errorToast("게시물 삭제 중 오류가 발생하였습니다.");
      });
  }

  if (question === null) {
    return <Spinner />;
  }

  return (
    <Box m={8}>
      <Box mt={2}>
        <Text value={question.id} />
      </Box>
      {account.hasAccess(question.userId) && (
        <Box>
          <Flex justify={"flex-end"} mr={10} mt={5} mb={5} gap={8}>
            <EditIcon
              w={6}
              h={6}
              color="blue.500"
              cursor="pointer"
              onClick={() => navigate(`/question/edit/${id}`)}
            />
            <DeleteIcon
              w={6}
              h={6}
              color="red.500"
              onClick={onOpen}
              cursor="pointer"
            />
          </Flex>
        </Box>
      )}
      <Divider borderColor={"black"} />
      <Table fontSize={"15px"}>
        <Tr>
          <Td bg="rgb(247,245,248)" w={"15%"} fontWeight={700}>
            제목
          </Td>
          <Td display={"flex"}>
            {" "}
            {question.secretWrite && (
              <Image src={"/img/lock.svg"} boxSize={"16px"} marginRight={1} />
            )}
            {question.title}{" "}
            <Box ml={3}>
              {question.isNewBadge && (
                <Badge colorScheme="green" fontSize={"10px"}>
                  New
                </Badge>
              )}
            </Box>
          </Td>
        </Tr>
        <Tr>
          <Td bg="rgb(247,245,248)" w={"15%"} fontWeight={700}>
            작성자
          </Td>
          <Td>{question.nickName}</Td>
        </Tr>
        <Tr>
          <Td bg="rgb(247,245,248)" w={"15%"} fontWeight={700}>
            작성일
          </Td>
          <Td>{question.inserted}</Td>
        </Tr>
        <Tr>
          <Td colSpan={2} whiteSpace={"pre-wrap"} pt={50} pb={50}>
            {question.content}
          </Td>
        </Tr>
      </Table>

      <Box>
        <Box mt={5}>
          {question.fileList && (
            <Flex flexWrap={"wrap"} justifyContent={"space-evenly"}>
              {question.fileList.map((file) => (
                <Card key={file.name}>
                  <CardBody>
                    <Image blockSize="300px" src={file.src} />
                  </CardBody>
                </Card>
              ))}
            </Flex>
          )}
        </Box>
      </Box>
      <Box>
        {/*댓글 컴포넌트*/}
        <CommentComponent questionId={question.id} />

        <Box mb={10} mt={20}>
          <Divider borderColor={"gray"} />
          <Flex h={10} alignItems={"center"} textAlign={"center"}>
            <Box w={"5%"}>
              <FontAwesomeIcon icon={faChevronUp} />
            </Box>
            <Box w={"10%"}>이전글</Box>
            <Box
              ml={3}
              cursor="pointer"
              onClick={() => {
                navigate(`/question/${question.prevId}`);
                window.scrollTo({ top: 240 });
              }}
            >
              {question.title}
            </Box>
          </Flex>
          <Divider borderColor={"gray"} />
          <Flex h={10} alignItems={"center"} textAlign={"center"}>
            <Box w={"5%"}>
              <FontAwesomeIcon icon={faChevronDown} />
            </Box>
            <Box w={"10%"}>
              <a href={`/question/${question.nextId}`}>다음글</a>
            </Box>
            <Box
              ml={3}
              cursor="pointer"
              onClick={() => {
                navigate(`/question/${question.nextId}`);
                window.scrollTo({ top: 240 });
              }}
            >
              {question.title}
            </Box>
          </Flex>
          <Divider borderColor={"gray"} />
        </Box>

        <Flex justifyContent="flex-start">
          <Button
            colorScheme={"teal"}
            w={"100px"}
            variant={"outline"}
            borderRadius={"unset"}
            onClick={() => navigate("/question/list")}
          >
            글 목록
          </Button>
        </Flex>
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
