import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Text,
} from "@chakra-ui/react";
import { faMoneyBillAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AuctionModal = ({
  isOpen,
  onClose,
  formattedPrice,
  handleJoinClick,
  handleIntegerNumber,
  bidPrice,
  isProcessing,
  product,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex align="center">
            <Box mr={2}>
              <FontAwesomeIcon icon={faMoneyBillAlt} size="lg" />
            </Box>
            <Heading fontSize="xl">경매 참여하기</Heading>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Box
            mb={6}
            p={4}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg="gray.50"
          >
            <Box>
              <Heading fontSize="lg" mb={4}>
                경매 참여 시 유의사항
              </Heading>

              <OrderedList>
                <ListItem mb={2}>
                  경매 참여는 신중하게 결정해야 합니다.
                </ListItem>
                <ListItem mb={2}>
                  중복 참여는 가능하나 마지막으로 기록된 입찰 금액으로만 경매에
                  참여하게 됩니다.
                </ListItem>
                <ListItem mb={2}>
                  경매 종료 후{" "}
                  <Box as="span" fontWeight="bold" color="blue.500">
                    낙찰여부는 마이 페이지 입찰내역에서 확인
                  </Box>
                  가능 합니다.
                </ListItem>
                <ListItem mb={2}>
                  입찰 금액을 입력할 때 반드시 제시된 가격보다 같거나 높아야
                  합니다.
                </ListItem>
              </OrderedList>
            </Box>
          </Box>
          <Text fontWeight={"bold"} fontSize={"lg"} mb={4}>
            시작가 : {formattedPrice(product.startPrice)} 원
          </Text>
          <FormControl mb={4}>
            <FormLabel mb={4}>입찰 금액</FormLabel>
            <InputGroup>
              <Input
                type="text"
                value={formattedPrice(bidPrice)}
                onChange={(e) => handleIntegerNumber(e)}
                placeholder="숫자만 입력하세요."
                borderRadius="none"
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.400", boxShadow: "outline" }}
              />
              <InputRightAddon>원</InputRightAddon>
            </InputGroup>
            {parseInt(bidPrice) < product.startPrice && (
              <FormHelperText color="red" mt={2}>
                입찰 금액이 시작가보다 작습니다.
              </FormHelperText>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            colorScheme="blue"
            borderWidth={2}
            onClick={handleJoinClick}
            isLoading={isProcessing}
            loadingText="처리중"
          >
            확인
          </Button>
          <Button variant="outline" borderWidth={2} onClick={onClose} ml={3}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuctionModal;
