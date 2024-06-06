import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Spacer,
} from "@chakra-ui/react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Header() {
  return (
    <Box>
      <Flex mb={7} gap={3}>
        <Center>
          <Heading size="2xl">Live Auction</Heading>
        </Center>
        <Spacer />
        <Center>
          <Box>
            <Flex>
              <Box>
                <InputGroup>
                  <InputLeftAddon>
                    <Button size={"100%"}>
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </Button>
                  </InputLeftAddon>
                  <Input w={"300px"} placeholder={"검색어를 입력하세요."} />
                </InputGroup>
              </Box>
              <Box gap={1}></Box>
            </Flex>
          </Box>
        </Center>
        <Spacer />
        <Center>
          <Box>판매하기</Box>
        </Center>
        <Center>
          <Box>채팅방</Box>
        </Center>
      </Flex>
    </Box>
  );
}
