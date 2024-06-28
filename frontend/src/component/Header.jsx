import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faComments, faUser } from "@fortawesome/free-regular-svg-icons"; // Import regular style FontAwesome icons
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";
import { faScaleUnbalanced } from "@fortawesome/free-solid-svg-icons/faScaleUnbalanced";

export function Header() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const keywordFromParams = searchParams.get("title");
    if (keywordFromParams) {
      setKeyword(keywordFromParams);
    } else {
      setKeyword("");
    }
  }, [searchParams]);

  function handleSearchClick(title) {
    navigate(`/list?title=${title}`);
  }

  // function handleCategoryClick(category) {
  //   if (category === "") {
  //     navigate(`/list`);
  //   } else {
  //     navigate(`/list?category=${category}`);
  //   }
  // }

  function handleMyAuctionOrLoginClick() {
    if (account.isLoggedIn()) {
      navigate(`/myPage/${account.id}`);
    } else {
      navigate(`/login`);
    }
  }

  function handleSaleOrLoginClick() {
    if (account.isLoggedIn()) {
      navigate(`/write`); // 로그인 상태일 때 write 페이지로 이동
    } else {
      navigate(`/login`); // 비로그인 상태일 때 로그인 페이지로 이동
    }
  }

  function handleTalkOrLoginClick() {
    if (account.isLoggedIn()) {
      navigate(`/chat/list`);
    } else {
      navigate(`/login`);
    }
  }

  return (
    <Box mb={4} height={"70px"}>
      <Flex align="center" justify="space-between" maxW="100%">
        {/* 로고 */}
        <Box>
          <Text
            fontWeight={"bold"}
            fontSize={"2xl"}
            color={"green"}
            cursor={"pointer"}
            onClick={() => navigate("/")}
          >
            {/*LIVE AUCTION{" "}*/}
            <Box w={"250px"}>
              <Image src={"/img/function.png"} />
              {/*<Image src={"/img/live.PNG"} />*/}
            </Box>
          </Text>
        </Box>

        {/* 검색 */}
        <Flex align={"center"}>
          <InputGroup border={"1px solid green"}>
            <Input
              _focus={{ boxShadow: "none" }}
              bg="transparent"
              border="none"
              w="400px"
              placeholder="상품명 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <InputRightAddon
              bg="transparent"
              border="none"
              onClick={() => handleSearchClick(keyword)}
            >
              <FontAwesomeIcon icon={faSearch} />
            </InputRightAddon>
          </InputGroup>
        </Flex>

        {/* 마이경매, 판매하기, 경매톡 */}
        <Flex align="center" justifyContent="center">
          <Box textAlign="center">
            <Button variant="unstyled" onClick={handleMyAuctionOrLoginClick}>
              <FontAwesomeIcon icon={faUser} size="xl" />
            </Button>
            <Text fontSize="small" mt={1}>
              마이경매
            </Text>
          </Box>

          <Box textAlign="center" ml={4}>
            <Button onClick={handleSaleOrLoginClick} variant="unstyled">
              <FontAwesomeIcon icon={faScaleUnbalanced} size="xl" />
            </Button>
            <Text fontSize="small" mt={1}>
              판매하기
            </Text>
          </Box>

          <Box textAlign="center" ml={4} mr={4}>
            <Button onClick={handleTalkOrLoginClick} variant="unstyled">
              <FontAwesomeIcon icon={faComments} size="xl" />
            </Button>
            <Text fontSize="small" mt={1}>
              채팅방
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
