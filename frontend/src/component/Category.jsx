import {
  Box,
  Button,
  Divider,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketShopping,
  faGlobe,
  faHeartPulse,
  faMobileScreenButton,
  faShirt,
  faTicket,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function Category() {
  const navigate = useNavigate();

  function handleCategoryClick(category) {
    if (category === "") {
      navigate(`/list`);
    } else {
      navigate(`/list?category=${category}`);
    }
  }

  return (
    <Box>
      <Menu>
        <Flex justifyContent="flex-start">
          <MenuButton
            as={Button}
            bg="transparent"
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            leftIcon={<HamburgerIcon />}
            size="lg"
            px={2} // 가로 내부 패딩 조정
          >
            카테고리
          </MenuButton>
        </Flex>
        <MenuList border="1px solid green" borderRadius={0} bg="white">
          <MenuItem
            onClick={() => handleCategoryClick("")}
            icon={<FontAwesomeIcon icon={faGlobe} />}
            _hover={{ bg: "green.50" }}
            _focus={{ bg: "green.50" }}
          >
            전체
          </MenuItem>
          <MenuItem
            onClick={() => handleCategoryClick("clothes")}
            icon={<FontAwesomeIcon icon={faShirt} />}
            _hover={{ bg: "green.50" }}
          >
            의류
          </MenuItem>
          <MenuItem
            onClick={() => handleCategoryClick("goods")}
            icon={<FontAwesomeIcon icon={faBasketShopping} />}
            _hover={{ bg: "green.50" }}
          >
            잡화
          </MenuItem>
          <MenuItem
            onClick={() => handleCategoryClick("food")}
            icon={<FontAwesomeIcon icon={faUtensils} />}
            _hover={{ bg: "green.50" }}
          >
            식품
          </MenuItem>
          <MenuItem
            onClick={() => handleCategoryClick("digital")}
            icon={<FontAwesomeIcon icon={faMobileScreenButton} />}
            _hover={{ bg: "green.50" }}
          >
            디지털
          </MenuItem>
          <MenuItem
            onClick={() => handleCategoryClick("sport")}
            icon={<FontAwesomeIcon icon={faHeartPulse} />}
            _hover={{ bg: "green.50" }}
          >
            스포츠
          </MenuItem>
          <MenuItem
            onClick={() => handleCategoryClick("e-coupon")}
            icon={<FontAwesomeIcon icon={faTicket} />}
            _hover={{ bg: "green.50" }}
          >
            e-쿠폰
          </MenuItem>
        </MenuList>
      </Menu>
      <Divider mt={2} borderWidth={1} borderColor={"green"} />
    </Box>
  );
}
