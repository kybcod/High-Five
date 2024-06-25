import {
  Box,
  Button,
  Card,
  CardBody,
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
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { BoardCommentComponent } from "./BoardCommentComponent.jsx";

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
      <Flex>
        <Box>
          <Text fontSize="30px">{board.title}</Text>
        </Box>
        <Spacer />
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
      <Flex>
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
      </Flex>
      <Flex>
        <Box>
          <Text>{board.nickName}</Text>
        </Box>
        <Spacer />
        <Box>
          <Text>{board.inserted}</Text>
        </Box>
      </Flex>
      <Box mt={3}>
        <Flex>
          {board.boardFileList &&
            board.boardFileList.length > 0 &&
            board.boardFileList.map((file, index) => (
              <Card m={3} key={index} w={"400px"}>
                <CardBody>
                  <Image src={file.filePath} sizes={"100%"} />
                </CardBody>
              </Card>
            ))}
        </Flex>
      </Box>
      <Box>
        <Textarea value={board.content} readOnly />
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
