import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketShopping,
  faHeartPulse,
  faMobileScreenButton,
  faSearch,
  faShirt,
  faTicket,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { faComments, faUser } from "@fortawesome/free-regular-svg-icons"; // Import regular style FontAwesome icons
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginContext } from "./LoginProvider.jsx";
import { HamburgerIcon } from "@chakra-ui/icons";
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

  function handleCategoryClick(category) {
    if (category === "") {
      navigate(`/list`);
    } else {
      navigate(`/list?category=${category}`);
    }
  }

  return (
    <Box border={"1px solid black"}>
      <Flex align="center" justify="space-between" maxW="100%">
        <Menu>
          <Box ml={2} h={"100%"} align={"center"}>
            <MenuButton as={Button} leftIcon={<HamburgerIcon />}>
              카테고리
            </MenuButton>
          </Box>
          <MenuList>
            <MenuItem
              onClick={() => handleCategoryClick("clothes")}
              icon={<FontAwesomeIcon icon={faShirt} />}
              _hover={{ color: "purple" }}
            >
              의류
            </MenuItem>
            <MenuItem
              onClick={() => handleCategoryClick("goods")}
              icon={<FontAwesomeIcon icon={faBasketShopping} />}
              _hover={{ color: "purple" }}
            >
              잡화
            </MenuItem>
            <MenuItem
              onClick={() => handleCategoryClick("food")}
              icon={<FontAwesomeIcon icon={faUtensils} />}
              _hover={{ color: "purple" }}
            >
              식품
            </MenuItem>
            <MenuItem
              onClick={() => handleCategoryClick("digital")}
              icon={<FontAwesomeIcon icon={faMobileScreenButton} />}
              _hover={{ color: "purple" }}
            >
              디지털
            </MenuItem>
            <MenuItem
              onClick={() => handleCategoryClick("sport")}
              icon={<FontAwesomeIcon icon={faHeartPulse} />}
              _hover={{ color: "purple" }}
            >
              스포츠
            </MenuItem>
            <MenuItem
              onClick={() => handleCategoryClick("e-coupon")}
              icon={<FontAwesomeIcon icon={faTicket} />}
              _hover={{ color: "purple" }}
            >
              e-쿠폰
            </MenuItem>
          </MenuList>
        </Menu>

        {/* 로고 */}
        <Box>
          <Text
            fontSize={"2xl"}
            color={"purple"}
            cursor={"pointer"}
            onClick={() => navigate("/")}
          >
            LIVE AUCTION{" "}
          </Text>
        </Box>

        {/* 검색 */}
        <Flex align={"center"}>
          <InputGroup border={"1px solid purple"}>
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
          {account.isLoggedIn() && (
            <>
              <Box textAlign="center">
                <Button
                  variant="unstyled"
                  onClick={() => navigate(`/myPage/${account.id}`)}
                >
                  <FontAwesomeIcon icon={faUser} size="xl" />
                </Button>
                <Text fontSize="small" mt={1}>
                  마이경매
                </Text>
              </Box>

              <Box textAlign="center" ml={4}>
                <Button onClick={() => navigate("/write")} variant="unstyled">
                  <FontAwesomeIcon icon={faScaleUnbalanced} size="xl" />
                </Button>
                <Text fontSize="small" mt={1}>
                  판매하기
                </Text>
              </Box>

              <Box textAlign="center" ml={4} mr={4}>
                <Button
                  onClick={() => navigate("/chat/list")}
                  variant="unstyled"
                >
                  <FontAwesomeIcon icon={faComments} size="xl" />
                </Button>
                <Text fontSize="small" mt={1}>
                  경매톡
                </Text>
              </Box>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
