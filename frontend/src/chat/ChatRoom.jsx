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

export function ChatRoom({ pId, bId, onBackClick }) {
  let { productId, buyerId } = useParams();
  if (pId != null && bId != null) {
    productId = pId;
    buyerId = bId;
  }
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
    setLoading(true);
    axios
      .get(`/api/chats/products/${productId}/buyer/${buyerId}`)
      .then((res) => {
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
      .catch((error) => {
        toast({
          status: "warning",
          description: "채팅방 조회 중 문제가 발생하였습니다.",
          position: "top",
          duration: 1000,
        });
        console.log(error);
        navigate(-1);
      })
      .finally(() => {
        setLoading(false);
      });

    // -- stomp
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
  }, [roomId, reviewId]);

  // -- stomp
  // useEffect(() => {
  //   const client = new StompJs.Client({
  //     brokerURL: "http://localhost:8080/ws",
  //     // connectHeaders: {
  //     //   login: "user",
  //     //   passcode: "password",
  //     // },
  //     debug: function (str) {
  //       console.log(str);
  //     },
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 30 * 1000,
  //     heartbeatOutgoing: 30 * 1000,
  //     onConnect: function () {
  //       client.subscribe(`/user/queue/chat`, callback, { ack: "client" }); // 상대방
  //       client.subscribe(`/topic/chat/${data.chatRoom.id}`, callback, {
  //         ack: "client",
  //       }); // 본인
  //     },
  //     onStompError: (frame) => {
  //       console.error("STOMP error: ", frame);
  //     },
  //   });
  //   // client.activate(); // 활성화
  //   setStompClient(client);
  //   return () => {
  //     if (stompClient) {
  //       disConnect();
  //     }
  //   };
  // }, [roomId]);

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
    setLoading(true);
    axios
      .get(`/api/reviews/list`)
      .then((res) => {
        if (res.data != null) {
          setReviewList(res.data);
        }
      })
      .catch((error) => {
        toast({
          title: "후기 리스트 조회 실패",
          description: "Unable to fetch data.",
          status: "error",
          duration: 1500,
          position: "top",
          isClosable: true,
        });
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
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
          title: "후기 등록 성공",
          status: "success",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: "후기 등록 실패",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
        console.log("error : ", error);
      })
      .finally(() => {
        setReviewId([]);
        setLoading(false);
      });
  };

  // -- 후기 조회
  const handleGetReviewButtonClick = () => {
    setLoading(true);
    axios
      .get(`/api/reviews/${data.product.id}`)
      .then((res) => {
        if (res.data != null) {
          setReviewList(res.data);
        }
      })
      .catch((error) => {
        toast({
          title: "후기 조회 실패",
          status: "error",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
        console.log("error : ", error);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const handleStoreButtonClick = () => {
    if (data.seller.id === tokenUserId) {
      navigate(`/myPage/${data.user.id}/shop`);
    } else {
      navigate(`/myPage/${data.seller.id}/shop`);
    }
  };

  const handleBackButtonClick = () => {
    if (pId !== undefined) {
      // 채팅방
      onBackClick();
    } else {
      // 문의하기
      disConnect();
      navigate(-1);
    }
  };

  // -- spinner
  if (data.chatRoom == null) {
    return <Spinner />;
  }

  return (
    <Box
      w={pId !== undefined ? "100%" : "80%"}
      border={"3px solid #00A457"}
      borderRadius={"10px"}
      h={"100%"}
    >
      <Box borderBottom={"2px solid #efefef"}>
        <Flex>
          {/* 뒤로 가기 */}
          <Box w={"10%"}>
            <Button
              onClick={handleBackButtonClick}
              variant={"outline"}
              color={"#00946F"}
              borderColor={"#ffffff"}
              w={"100%"}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </Button>
          </Box>
          {/* 상대방 상점 */}
          <Center cursor={"pointer"} w={"80%"}>
            <Box fontSize={"xl"}>
              <Button
                onClick={handleStoreButtonClick}
                variant="link"
                color={"#00946F"}
                size={"lg"}
                as={"b"}
              >
                {data.seller.id === tokenUserId
                  ? `${data.user.nickName}`
                  : `${data.seller.nickName}`}
              </Button>
            </Box>
          </Center>
          <Box w={"10%"}>
            <Menu>
              <MenuButton
                as={Button}
                w={"100%"}
                variant={"outline"}
                borderColor={"#ffffff"}
                color={"#00946F"}
              >
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
      <Box borderBottom={"2px solid #efefef"} mb={2}>
        <Stack direction={"row"} align={"center"}>
          <Button
            w={"80%"}
            variant={"link"}
            color={"#00946F"}
            isDisabled={data.product.title === "삭제된 상품입니다."}
            onClick={() => navigate(`/product/${data.product.id}`)}
          >
            {data.product.title}
          </Button>
          {/* 상품 상태 */}
          {buttonConfig && (
            <Button
              w={"20%"}
              variant={"outline"}
              borderColor={"#ffffff"}
              color={"#00946F"}
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
            h={"455px"}
            spacing={4}
            flex={1}
            // flexDirection={"column-reverse"}
            overflowY={"auto"}
            w={"full"}
            borderBottom={"2px solid #efefef"}
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
                  ml={msg.userId !== tokenUserId && 3}
                  mr={msg.userId === tokenUserId && 3}
                >
                  <Box
                    border={"1px solid #f1f1f1"}
                    textAlign={msg.userId === tokenUserId ? "right" : "left"}
                    bg={msg.userId === tokenUserId ? "#efefef" : "#fcfcfc"}
                    borderRadius={"15px"}
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
          <Box p={1}>
            <Flex>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                focusBorderColor={"#006E7B"}
                w={"80%"}
              />
              <Button
                isDisabled={message.trim().length === 0}
                onClick={sendMessage}
                variant="outline"
                color={"#006E7B"}
                borderColor={"#efefef"}
                w={"20%"}
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
              size={"sm"}
              variant={"outline"}
              colorScheme={"teal"}
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
