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
  VStack,
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
import CustomModal from "./CustomModal.jsx";

export function ChatRoom() {
  const { productId, buyerId } = useParams();
  const account = useContext(LoginContext);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  // -- axios.get
  const [data, setData] = useState({
    seller: {},
    product: {},
    bidder: {},
    previousChatList: [],
    user: {},
    chatRoom: {},
  });
  const [roomId, setRoomId] = useState(null);
  // -- chat
  const [stompClient, setStompClient] = useState(null);
  const [message, setMessage] = useState(""); // 입력된 채팅 내용
  const [messageList, setMessageList] = useState([]);
  // -- review
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reviewList, setReviewList] = useState([]);
  const [reviewId, setReviewId] = useState([]);
  const tokenUserId = Number(account.id);
  // -- Modal
  const {
    isOpen: isOpenChatRoomDelete,
    onOpen: onOpenChatRoomDelete,
    onClose: onCloseChatRoomDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenBlackUserPut,
    onOpen: onOpenBlackUserPut,
    onClose: onCloseBlackUserPut,
  } = useDisclosure();

  // -- axios.get
  useEffect(() => {
    // TODO : status 추가
    axios
      .get(`/api/chats/products/${productId}/buyer/${buyerId}`)
      .then((res) => {
        console.log(res.data);
        const { user, seller, product, chatRoom, bidder, previousChatList } =
          res.data;
        if (res.data != null) {
          setData({
            seller: seller || {},
            product: product || {},
            bidder: bidder || {},
            previousChatList: previousChatList || {},
            user: user || {},
            chatRoom: chatRoom || {},
          });
          setMessageList(res.data.previousChatList);
          setRoomId(res.data.chatRoom.id);
        }
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "채팅방 조회 중 문제가 발생하였습니다.",
          position: "top",
          duration: 1000,
        });
        navigate(-1);
      })
      .finally();
  }, []);

  // -- stomp
  useEffect(() => {
    const client = new StompJs.Client({
      brokerURL: "http://localhost:8080/ws",
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
        // TODO : 필요한 코드인지 생각해보기
        client.subscribe(`/user/queue/chat`, callback, { ack: "client" }); // 상대방
        client.subscribe(`/topic/chat/${data.chatRoom.id}`, callback, {
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
    // 전송 시간 추가
    receivedMessage.inserted = new Date().toLocaleTimeString();
    setMessageList((prevMessages) => [...prevMessages, receivedMessage]);
    message.ack();
  };

  const sendMessage = () => {
    let chatMessage = {
      chatRoomId: data.chatRoom.id,
      userId: account.id,
      message: message,
    };

    stompClient.publish({
      destination: `/app/chat`,
      body: JSON.stringify(chatMessage),
    });

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
        if (res.data != null) {
          setReviewList(res.data);
        }
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

  const handleProductDetailPage = () => {
    navigate(`/product/${data.product.id}`);
  };

  const handlePayDetailPage = () => {
    navigate(`/pay/buyer/${data.user.id}/product/${data.product.id}`);
  };

  const handleSaveReviewButtonClick = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post(`/api/reviews`, {
        productId: data.product.id,
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

  // -- 후기 조회
  const handleGetReviewButtonClick = () => {
    axios
      .get(`/api/reviews/${data.product.id}`)
      .then((res) => {
        if (res.data != null) {
          setReviewList(res.data);
        }
      })
      .catch()
      .finally();
  };

  // -- productStatusButton
  const determineButton = () => {
    if (data.user.id === tokenUserId) {
      // 구매자
      if (data.product.status) {
        return {
          label: "입찰 가능 상품",
          action: () => handleProductDetailPage(),
        };
      } else {
        if (data.bidder.bidStatus) {
          if (!data.product.paymentStatus) {
            return {
              label: "결제 하러 가기",
              action: () => handlePayDetailPage(),
            };
          }
          if (data.product.paymentStatus && !data.product.reviewStatus) {
            return {
              label: "후기 작성 하기",
              action: () => {
                onOpen();
                handleReviewButtonClick();
              },
            };
          }
          if (data.product.reviewStatus) {
            return {
              label: "작성 후기 확인",
              action: () => {
                onOpen();
                handleGetReviewButtonClick();
              },
            };
          }
        }
        return { label: "입찰 종료 상품", action: null, disabled: true };
      }
    } else {
      // 판매자
      if (data.product.status) {
        return {
          label: "입찰 진행 상품",
          action: () => handleProductDetailPage(),
        };
      } else {
        if (data.user.id === data.product.buyerId) {
          if (!data.product.paymentStatus) {
            return {
              label: "결제 대기 상품",
              action: null,
              disabled: true,
            };
          }
          if (data.product.paymentStatus && !data.product.reviewStatus) {
            return {
              label: "결제 완료 상품",
              action: null,
              disabled: true,
            };
          }
          if (data.product.reviewStatus) {
            return {
              label: "받은 후기 확인",
              action: () => {
                onOpen();
                handleGetReviewButtonClick();
              },
            };
          }
        }
        return {
          label: "입찰 종료 상품",
          action: null,
          disabled: true,
        };
      }
    }
  };
  const buttonConfig = determineButton();

  // -- spinner
  if (data.chatRoom == null) {
    return <Spinner />;
  }

  return (
    <Box w={"70%"} border={"1px solid gray"}>
      <Box border={"1px solid red"}>
        <Flex>
          {/* 뒤로 가기 */}
          <Box w={"10%"} border={"1px solid gray"}>
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
          <Center cursor={"pointer"} w={"80%"} border={"1px solid blue"}>
            <Box fontSize={"xl"}>
              {data.seller.id === tokenUserId ? (
                <Text onClick={() => navigate(`/myPage/${data.user.id}/shop`)}>
                  {data.user.nickName}
                </Text>
              ) : (
                <Text
                  onClick={() => navigate(`/myPage/${data.seller.id}/shop`)}
                >
                  {data.seller.nickName}
                </Text>
              )}
            </Box>
          </Center>
          <Box w={"10%"} border={"1px solid yellow"}>
            <Menu>
              <MenuButton as={Button}>
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </MenuButton>
              <MenuList>
                <MenuItem
                  gap={2}
                  onClick={() => {
                    onOpenBlackUserPut();
                  }}
                >
                  <FontAwesomeIcon icon={faCircleExclamation} />
                  신고하기
                </MenuItem>
                <MenuItem
                  color={"red"}
                  gap={2}
                  onClick={() => {
                    onOpenChatRoomDelete();
                  }}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                  채팅방 나가기
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Box>
      <Box border={"1px solid green"}>
        <Stack direction={"row"} align={"center"}>
          <Button
            w={"80%"}
            variant="link"
            isDisabled={
              data.product.title == "삭제된 상품입니다." ? true : false
            }
            onClick={() => navigate(`/product/${data.product.id}`)}
          >
            {data.product.title}
          </Button>
          {/* 상품 상태 */}
          {buttonConfig && (
            <Button
              w={"20%"}
              variant="ghost"
              onClick={buttonConfig.action}
              isDisabled={buttonConfig.disabled}
            >
              {buttonConfig.label}
            </Button>
          )}
        </Stack>
      </Box>
      <Box>
        <Box>
          <VStack
            h={"500px"}
            spacing={4}
            flex={1}
            // flexDirection={"column-reverse"}
            overflowY={"auto"}
            w={"full"}
          >
            {messageList.map((msg, index) => (
              <Flex
                key={index}
                justifyContent={
                  msg.userId === tokenUserId ? "flex-end" : "flex-start"
                }
                w="full"
                mb={1}
              >
                <Flex
                  flexDirection="column"
                  alignItems={
                    msg.userId === tokenUserId ? "flex-end" : "flex-start"
                  }
                >
                  <Box
                    textAlign={msg.userId === tokenUserId ? "right" : "left"}
                    bg={msg.userId === tokenUserId ? "green.200" : "gray.100"}
                    borderRadius="18px"
                    p={2}
                    maxW="100%"
                    mb={1}
                    position="relative"
                  >
                    <Text p={1}>{msg.message}</Text>
                  </Box>
                  <Text fontSize="xs" color="gray.500">
                    {msg.readCheck !== true && "전송됨"} {msg.inserted}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </VStack>
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
          {data.product.reviewStatus === false ? (
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
              hidden={data.product.reviewStatus === true}
            >
              후기 보내기
            </Button>
          </ModalFooter>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
      <CustomModal
        isOpen={isOpenChatRoomDelete}
        onClose={onCloseChatRoomDelete}
        method={"delete"}
        header={"채팅방 나가기"}
        body={"채팅방을 나가시겠습니까?"}
        buttonContent={"나가기"}
        url={`/api/chats/${data.chatRoom.id}`}
      />
      <CustomModal
        isOpen={isOpenBlackUserPut}
        onClose={onCloseBlackUserPut}
        method={"put"}
        header={"신고하시겠습니까?"}
        body={"허위 신고 적발 시 불이익을 받게됩니다"}
        buttonContent={"신고하기"}
        url={`/api/users/black/${data.user.id === tokenUserId ? data.seller.id : data.user.id}`}
      />
    </Box>
  );
}
