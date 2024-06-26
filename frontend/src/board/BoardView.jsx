import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";
import { BoardCommentComponent } from "./BoardCommentComponent.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

export function BoardView() {
  const [board, setBoard] = useState("");
  const [boardLike, setBoardLike] = useState({ boardLike: false, count: 0 });
  const [isLikeProcess, setIsLikeProcess] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { successToast, errorToast } = CustomToast();
  const account = useContext(LoginContext);
  const { board_id } = useParams();

  useEffect(() => {
    axios.get(`/api/board/${board_id}`).then((res) => {
      setBoard(res.data.board);
      setBoardLike(res.data.boardLike);
    });
  }, []);

  function handleClickDelete() {
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

  function handleClickLike() {
    if (!account.isLoggedIn()) {
      return;
    }
    setIsLikeProcess(true);
    axios
      .put(`/api/board/like/${board_id}`, { boardId: board.id })
      .then((res) => {
        setBoardLike(res.data.boardLike);
        setBoard(res.data.board);
      })
      .finally(() => {
        setIsLikeProcess(false);
      });
  }

  return (
    <Box>
      <Box>
        <Heading>자유게시판 게시글</Heading>
      </Box>
      <Box ml={5} mt={"30px"}>
        <Text fontSize="4xl">{board.title}</Text>
      </Box>
      <Flex>
        {board.profileImage && board.profileImage.fileName == null && (
          <Image
            borderRadius="full"
            boxSize="150px"
            fallbackSrc="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800"
            src={board.profileImage.src}
            alt="Default Profile Image"
          />
        )}
        {board.profileImage && board.profileImage.fileName != null && (
          <Image
            borderRadius="full"
            boxSize="150px"
            src={board.profileImage.src}
            alt="Profile Image"
          />
        )}
        <Box>
          <Text>{board.nickName}</Text>
        </Box>
        <Box>
          <Text>{board.inserted}</Text>
        </Box>
        <Spacer />
        {account.hasAccess(board.userId) && (
          <Flex>
            <Box>
              <Text onClick={() => navigate(`/board/modify/${board_id}`)}>
                수정
              </Text>
            </Box>
            <Box>
              <Text onClick={onOpen}>삭제</Text>
            </Box>
          </Flex>
        )}
        {isLikeProcess || (
          <Box onClick={handleClickLike}>
            <Flex>
              {boardLike.boardLike && <FontAwesomeIcon icon={fullHeart} />}
              {boardLike.boardLike || <FontAwesomeIcon icon={emptyHeart} />}
              {boardLike.count > 0 && <Box>{boardLike.count}</Box>}
            </Flex>
          </Box>
        )}
        {isLikeProcess && (
          <Box>
            <Spinner />
          </Box>
        )}
      </Flex>
      <Box border={"1px"} color={"gray.200"} borderRadius={"md"}>
        <Flex flexWrap={"wrap"} justifyContent={"space-evenly"} p={"20px"}>
          {board.boardFileList &&
            board.boardFileList.length > 0 &&
            board.boardFileList.map((file, index) => (
              <Card
                mt={"10px"}
                key={index}
                w={"calc(33.33% - 10px)"}
                boxShadow={"none"}
                border={"none"}
              >
                <Image src={file.filePath} w={"100%"} h={"300px"} />
              </Card>
            ))}
        </Flex>
        <Box p={"30px"}>
          <Text color={"black"} fontSize={"md"}>
            {board.content}
          </Text>
        </Box>
      </Box>
      <Box>
        <BoardCommentComponent boardId={board_id} />
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
              <Button onClick={handleClickDelete} colorScheme={"red"}>
                삭제
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
