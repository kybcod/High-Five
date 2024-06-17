import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Spacer,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../component/LoginProvider.jsx";
import { CustomToast } from "../component/CustomToast.jsx";

export function BoardView() {
  const [board, setBoard] = useState("");
  const navigate = useNavigate();
  const { successToast, errorToast } = CustomToast();
  const account = useContext(LoginContext);
  const { board_id } = useParams();

  useEffect(() => {
    axios.get(`/api/board/${board_id}`).then((res) => setBoard(res.data));
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

  return (
    <Box>
      <Box>
        <Heading>자유게시판 게시글</Heading>
      </Box>
      <Box>
        <Text fontSize="30px">{board.title}</Text>
      </Box>
      <Flex>
        <Flex>
          <Box>
            <Text>{board.userId}</Text>
          </Box>
          <Box>
            <Text>{board.inserted}</Text>
          </Box>
        </Flex>
        <Spacer />
        {account.hasAccess(board.userId) && (
          <Flex>
            <Box>
              <Text onClick={() => navigate(`/board/modify/${board_id}`)}>
                수정
              </Text>
            </Box>
            <Box>
              <Text onClick={handleClickDelete}>삭제</Text>
            </Box>
          </Flex>
        )}
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
    </Box>
  );
}
