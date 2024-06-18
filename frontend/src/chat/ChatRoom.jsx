import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Input,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../component/LoginProvider.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faCircleCheck,
  faCircleExclamation,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function ChatRoom() {
  const { productId } = useParams();
  const account = useContext(LoginContext);
  // -- axios.get
  const [roomInfo, setRoomInfo] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
  const [roomId, setRoomId] = useState(null);
  // -- chat
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState(""); // 입력된 채팅 내용
  const [messages, setMessages] = useState([]); // 채팅 리스트
  // -- review
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reviewList, setReviewList] = useState([]);
  const [reviewId, setReviewId] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // -- axios.get
  useEffect(() => {
    // TODO : status 추가
    axios
      .get(`/api/chat/${productId}`)
      .then((res) => {
        setRoomInfo(res.data.chatRoom);
        setProductInfo(res.data.chatProduct);
        setRoomId(res.data.chatRoom.id);
        if (!res.data.firstChat) {
          setMessages(res.data.messageList);
        }
      })
      .catch()
      .finally();
  }, []);

  // -- stomp
  useEffect(() => {
    const client = new StompJs.Client({
      brokerURL: "ws://localhost:8080/ws",
      // connectHeaders: {
      //   login: "user",
      //   passcode: "password",
      // },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 30 * 1000,
      heartbeatOutgoing: 30 * 1000,
      onConnect: function () {
        console.log("Connected to WebSocket");
        client.subscribe(`/user/queue/chat`, callback, { ack: "client" }); // 상대방
        client.subscribe(`/topic/chat/${roomId}`, callback, {
          ack: "client",
        }); // 본인
      },
      onStompError: (frame) => {
        console.error("STOMP error: ", frame);
      },
    });

    // TODO : merge 전 주석 생성 / update 이후 주석 제거
    client.activate(); // 활성화
    setStompClient(client);

    return () => {
      if (stompClient) {
        disConnect();
      }
    };
  }, [roomId]);

  const callback = (message) => {
    const receivedMessage = JSON.parse(message.body);
    setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    message.ack();
  };

  const sendMessage = () => {
    let chatMessage = {
      chatRoomId: roomInfo.id,
      userId: account.id,
      message: message,
    };

    stompClient.publish({
      destination: `/app/chat`,
      body: JSON.stringify(chatMessage),
    });

    // 전송 시간 추가
    chatMessage.inserted = new Date().toLocaleTimeString();

    // -- 내가 보낸 거
    let formattedMessage = chatMessage;
    setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    setMessage("");
  };

  // -- 비활성화
  const disConnect = () => {
    stompClient.deactivate();
    console.log("Disconnected");
  };

  // -- review list
  const handleReviewButtonClick = () => {
    // TODO : status 추가
    axios
      .get(`/api/reviews/list`)
      .then((res) => {
        setReviewList(res.data);
      })
      .catch()
      .finally();
  };

  // -- review check
  const handleReviewChange = (event) => {
    const id = parseInt(event.target.value);
    if (event.target.checked) {
      setReviewId([...reviewId, id]);
    } else {
      setReviewId([reviewId.filter((reviewId) => reviewId !== id)]);
    }
  };

  const handleSaveReviewButtonClick = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post(`/api/reviews`, {
        productId: roomInfo.productId,
        userId: account.id,
        reviewId,
      })
      .then(() => {
        toast({
          description: "리뷰가 등록되었습니다.",
          status: "success",
          position: "top",
        });
        onClose();
      })
      .catch((e) => {
        const code = e.response.status;

        if (code === 400) {
          toast({
            status: "error",
            description: "리뷰 등록 실패",
            position: "top",
          });
        }
      })
      .finally(() => {
        setLoading(false);
        setReviewId([]);
      });
  };
  const handleGetReviewButtonClick = () => {
    axios
      .get(`/api/reviews/${productId}`)
      .then((res) => {
        setReviewList(res.data.reviewList);
      })
      .catch()
      .finally();
  };

  // spinner
  if (roomInfo == null) {
    return <Spinner />;
  }

  return (
    <Box w={"70%"}>
      <Box>
        <Flex>
          {/* 뒤로 가기 */}
          <Box w={"10%"}>
            <Button
              onClick={() => {
                disConnect();
                navigate(-1);
              }}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </Button>
          </Box>
          {/* 상대방 상점 */}
          <Center cursor={"pointer"} w={"80%"}>
            <Box fontSize={"xl"}>
              {roomInfo.sellerId === Number(account.id) ? (
                <Text
                  onClick={() => navigate(`/myPage/${roomInfo.userId}/shop`)}
                >
                  {roomInfo.userName}
                </Text>
              ) : (
                <Text
                  onClick={() => navigate(`/myPage/${roomInfo.sellerId}/shop`)}
                >
                  {roomInfo.sellerName}
                </Text>
              )}
            </Box>
          </Center>
          <Box w={"10%"}>
            <Menu>
              <MenuButton as={Button}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </MenuButton>
              <MenuList>
                {/* TODO : 채팅방 신고하기 */}
                <MenuItem gap={2}>
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  신고하기
                </MenuItem>
                {/* TODO : 채팅방 나가기 */}
                <MenuItem color={"red"} gap={2}>
                  <FontAwesomeIcon icon={faTrashCan} />
                  채팅방 나가기
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Box>
      <Box>
        <Flex>
          <Box
            cursor={"pointer"}
            onClick={() => navigate(`/product/${productInfo.id}`)}
            w={"80%"}
          >
            <Text>{productInfo.title}</Text>
          </Box>
          <Box w={"20%"}>
            {/* 상품 상태 */}
            {/* 0 현재 판매 종료, 1 판매 중*/}
            {/* TODO : Notion 정리 */}
            {productInfo.status === 0 &&
            productInfo.buyerId === Number(account.id) &&
            productInfo.reviewStatus === 0 ? (
              <Button
                onClick={() => {
                  onOpen();
                  handleReviewButtonClick();
                }}
              >
                후기 등록
              </Button>
            ) : productInfo.status === 0 &&
              productInfo.buyerId === Number(account.id) &&
              productInfo.reviewStatus === 1 ? (
              <Button
                onClick={() => {
                  onOpen();
                  handleGetReviewButtonClick();
                }}
              >
                작성 후기 확인
              </Button>
            ) : productInfo.status === 1 ? (
              <Button onClick={() => navigate(`/product/${productInfo.id}`)}>
                입찰 가능 상품
              </Button>
            ) : (
              <Button isDisabled={true}>판매 종료 상품</Button>
            )}
          </Box>
        </Flex>
      </Box>
      <Box>
        <Box>
          <Box h={"500px"} overflow={"auto"}>
            {messages.map((msg, index) => (
              <Box key={index}>
                <Flex>
                  <Text>
                    {/* 변수의 형식까지 비교하기 위해 account.id 문자열을 숫자로 변경 */}
                    {msg.userId == account.id ? (
                      <>{roomInfo.userName}</>
                    ) : (
                      <>{roomInfo.sellerName}</>
                    )}
                  </Text>
                  <Text> : {msg.message}</Text>
                </Flex>
                <Text fontSize={"xs"}>{msg.inserted}</Text>
              </Box>
            ))}
          </Box>
          <Box>
            <Flex>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                isDisabled={message.trim().length === 0}
                onClick={sendMessage}
              >
                send
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>
      {/* 후기 작성 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>판매자님에게 보내는 후기</ModalHeader>
          {productInfo.reviewStatus === 0 ? (
            <ModalBody>
              <Stack>
                {reviewList.map((review) => (
                  <Checkbox
                    key={review.id}
                    onChange={handleReviewChange}
                    value={review.id}
                  >
                    {review.content}
                  </Checkbox>
                ))}
              </Stack>
            </ModalBody>
          ) : (
            <ModalBody>
              <List>
                {reviewList.map((review) => (
                  <ListItem key={review.id}>
                    <FontAwesomeIcon icon={faCircleCheck} />
                    &nbsp;
                    {review.content}
                  </ListItem>
                ))}
              </List>
            </ModalBody>
          )}
          <ModalFooter>
            <Button
              isLoading={loading}
              isDisabled={reviewId.length === 0}
              onClick={handleSaveReviewButtonClick}
              hidden={productInfo.reviewStatus === 1}
            >
              후기 보내기
            </Button>
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </Box>
  );
}
