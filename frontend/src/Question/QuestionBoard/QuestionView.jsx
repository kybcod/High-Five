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
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Td,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { CommentComponent } from "../Comment/CommentComponent.jsx";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { CustomToast } from "../../component/CustomToast.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { PrevNextTitle } from "../PrevNextTitle.jsx";

export function QuestionView() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const navigate = useNavigate();
  const {
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
    isOpen: isDeleteOpen,
  } = useDisclosure();
  const {
    onOpen: onImageOpen,
    onClose: onImageClose,
    isOpen: isImageOpen,
  } = useDisclosure();
  const account = useContext(LoginContext);
  const { successToast, errorToast } = CustomToast();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/question/${id}`)
      .then((res) => {
        setQuestion(res.data);
      })
      .catch((err) => {
        err.response.status === 403
          ? // errorToast("비밀글에 접근할 권한이 없습니다.")
            alert("비밀글에 접근할 권한이 없습니다.")
          : (errorToast("해당 게시글이 없습니다."), navigate("/question/list"));
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
          ? errorToast("권한이 없는 사용자 입니다.")
          : errorToast("게시물 삭제 중 오류가 발생하였습니다.");
      });
  }

  if (question === null) {
    return <Spinner />;
  }

  return (
    <Box m={8}>
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
              onClick={onDeleteOpen}
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
          <Td>{question.insertedAll}</Td>
        </Tr>
        <Tr>
          <Td colSpan={2} whiteSpace={"pre-wrap"} pt={50} pb={50}>
            {question.content}
          </Td>
        </Tr>
      </Table>

      <Box>
        <Box mt={30}>
          {question.fileList && (
            <Flex flexWrap={"wrap"} gap={5} justifyContent={"flex-start"}>
              {question.fileList.map((file) => (
                <Card key={file.name}>
                  <CardBody>
                    <Image
                      boxSize="300px"
                      src={file.src}
                      onClick={() => {
                        setSelectedImage(file.src);
                        onImageOpen();
                      }}
                      cursor={"pointer"}
                    />
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
          {question.prevId && (
            <>
              <Flex h={10} alignItems={"center"} textAlign={"center"}>
                <Box w={"5%"}>
                  <FontAwesomeIcon icon={faChevronUp} />
                </Box>
                <Box w={"10%"}>이전글</Box>
                <PrevNextTitle
                  secret={question.prevSecret}
                  hasAccess={(prevUserId) => account.hasAccess(prevUserId)}
                  isAdmin={() => account.isAdmin(account.userId)}
                  title={question.prevTitle}
                  userId={question.prevUserId}
                  navigateTo={() => navigate(`/question/${question.prevId}`)}
                />
              </Flex>
              <Divider borderColor={"gray"} />
            </>
          )}

          {question.nextId && (
            <>
              <Flex h={10} alignItems={"center"} textAlign={"center"}>
                <Box w={"5%"}>
                  <FontAwesomeIcon icon={faChevronDown} />
                </Box>
                <Box w={"10%"}>
                  <a href={`/question/${question.nextId}`}>다음글</a>
                </Box>
                <PrevNextTitle
                  secret={question.nextSecret}
                  hasAccess={(nextUserId) => account.hasAccess(nextUserId)}
                  isAdmin={() => account.isAdmin(account.userId)}
                  title={question.nextTitle}
                  userId={question.nextUserId}
                  navigateTo={() => navigate(`/question/${question.nextId}`)}
                />
              </Flex>
              <Divider borderColor={"gray"} />
            </>
          )}
        </Box>

        <Flex justifyContent="space-between">
          <Button
            colorScheme={"teal"}
            w={"100px"}
            variant={"outline"}
            borderRadius={"unset"}
            onClick={() => navigate("/question/list")}
          >
            글 목록
          </Button>
          <Button
            colorScheme={"teal"}
            w={"100px"}
            variant={"outline"}
            borderRadius={"unset"}
            onClick={() => navigate("/question/write")}
          >
            글쓰기
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Flex gap={2}>
              <Button onClick={onDeleteClose}>취소</Button>
              <Button onClick={handleRemoveClick} colorScheme={"red"}>
                확인
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isImageOpen} onClose={onImageClose} size="5xl">
        <ModalOverlay />
        <ModalContent maxW="40vw" maxH="90vh">
          <ModalCloseButton />
          <ModalBody
            p={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              src={selectedImage}
              alt="원본 이미지"
              objectFit="contain"
              maxW="40vw"
              maxH="90vh"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
