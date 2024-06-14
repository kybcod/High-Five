import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Spacer,
} from "@chakra-ui/react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";

export function Header() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  function handleSearchClick(keyword) {
    navigate(`/list?keyword=${keyword}`);
  }

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
                  <Input
                    w={"300px"}
                    placeholder={"검색어를 입력하세요."}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <InputRightAddon>
                    <Button
                      onClick={() => handleSearchClick(keyword)}
                      size={"100%"}
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </Button>
                  </InputRightAddon>
                </InputGroup>
              </Box>
              <Box gap={1}></Box>
            </Flex>
          </Box>
        </Center>
        <Spacer />
        <Center>
          <Box>
            {account.isLoggedIn() && (
              <Center onClick={() => navigate("/write")} cursor={"pointer"}>
                판매하기
              </Center>
            )}
          </Box>
        </Center>
        <Center>
          <Box>채팅방</Box>
        </Center>
      </Flex>
    </Box>
  );
}
