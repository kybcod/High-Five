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
import {
  faComments,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";

export function Header() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const keyword1 = searchParams.get("keyword");
    if (keyword1) {
      setKeyword(keyword1);
    } else {
      setKeyword("");
    }
  }, [searchParams]);

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
                    value={keyword}
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
          {account.isLoggedIn() && (
            <Box onClick={() => navigate("/chat/list")} cursor={"pointer"}>
              <FontAwesomeIcon icon={faComments} />
            </Box>
          )}
        </Center>
      </Flex>
    </Box>
  );
}
