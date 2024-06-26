import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faSackDollar,
  faSearch,
} from "@fortawesome/free-solid-svg-icons"; // FontAwesome에서 추가 아이콘 가져오기
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";

export function Header() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const keywordFromParams = searchParams.get("keyword");
    if (keywordFromParams) {
      setKeyword(keywordFromParams);
    } else {
      setKeyword("");
    }
  }, [searchParams]);

  function handleSearchClick(keyword) {
    navigate(`/list?keyword=${keyword}`);
  }

  return (
    <Box py={4}>
      <Flex align="center" justify="space-between" maxW="100%" mx="auto">
        {/* 로고 */}
        <Box>
          <Heading cursor={"pointer"} onClick={() => navigate("/")}>
            LIVE AUCTION{" "}
          </Heading>
        </Box>

        {/* 검색 */}
        <Flex align={"center"}>
          <InputGroup>
            <Input
              w="500px"
              placeholder="상품명 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <InputRightAddon
              // bgColor={"mediumslateblue"}
              onClick={() => handleSearchClick(keyword)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </InputRightAddon>
          </InputGroup>
        </Flex>

        {/* 판매하기, 경매톡 */}
        <Stack direction="row" spacing={2}>
          {account.isLoggedIn() && (
            <>
              <Button
                onClick={() => navigate("/write")}
                size="md"
                ml={4}
                leftIcon={<FontAwesomeIcon icon={faSackDollar} />}
                colorScheme="pink"
                variant="unstyled"
              >
                판매하기
              </Button>

              <Box
                height="24px"
                borderLeft="1px solid #ccc"
                mx={2}
                alignSelf="center"
              />

              <Button
                onClick={() => navigate("/chat/list")}
                size="md"
                ml={4}
                leftIcon={<FontAwesomeIcon icon={faComments} />}
                colorScheme="blue"
                variant="unstyled"
              >
                경매톡
              </Button>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
