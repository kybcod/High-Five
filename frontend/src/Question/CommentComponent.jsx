import { Box, Heading } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { CommentWrite } from "./CommentWrite.jsx";
import { CommentList } from "./CommentList.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { useContext } from "react";

export function CommentComponent({ questionId }) {
  return (
    <Box>
      <Box mb={5}>
        <Heading>
          <FontAwesomeIcon icon={faComments} />
          댓글
        </Heading>
      </Box>
      <Box mb={5}>
        <CommentWrite questionId={questionId} />
      </Box>
      <Box>
        <CommentList questionId={questionId} />
      </Box>
    </Box>
  );
}
