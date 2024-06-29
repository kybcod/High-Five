import {
  Box,
  Flex,
  Heading,
  Image,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyShop } from "./MyShop.jsx";
import { LikeList } from "./LikeList.jsx";
import axios from "axios";
import { UserInfo } from "./UserInfo.jsx";
import { BidList } from "./BidList.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";
import { faBox, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function MyPage({ tab }) {
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [product, setProduct] = useState(null);
  const [userNickName, setUserNickName] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  const account = useContext(LoginContext);

  // 탭 이름 -> 인덱스
  const tabIndex = {
    shop: 0,
    likes: 1,
    bids: 2,
    userInfo: 3,
  };

  // 인덱스 -> 택이름
  const indexTab = {
    0: "shop",
    1: "likes",
    2: "bids",
    3: "userInfo",
  };

  const currentTab = tab;

  useEffect(() => {
    axios.get(`/api/products/user/${userId}`).then((res) => {
      console.log(res.data);
      setProduct(res.data.productList);
      setUserNickName(res.data.userNickName);
      setTotalSalesCount(res.data.totalSalesCount);
      setTotalProductCount(res.data.totalProductCount);
    });

    axios.get(`/api/users/${userId}`).then((res) => {
      setUser(res.data);
    });
  }, []);

  const handleTabsChange = (index) => {
    navigate(`/myPage/${userId}/${indexTab[index]}`);
  };

  if (product === null || user === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Tabs
        variant="unstyled"
        orientation={"vertical"}
        index={tabIndex[currentTab]}
        onChange={handleTabsChange}
      >
        {/*  user 이미지*/}
        <TabList w={"30%"} m={3} mr={20}>
          <Box mb={4} w="100%">
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              p={4}
            >
              <Image
                src={user.profileImage.src}
                alt="상점 프로필 이미지"
                boxSize="100px"
                fallbackSrc="https://study34980.s3.ap-northeast-2.amazonaws.com/prj3/profile/original_profile.jpg"
                borderRadius="full"
                mb={4}
              />
              <Heading textAlign="center" size="md">
                {userNickName}
              </Heading>
            </Flex>
            <Flex
              justify="space-between"
              p={4}
              borderTopWidth="1px"
              borderColor="gray.200"
            >
              <Flex flexDirection="column" alignItems="center" flex="1">
                <Flex align="center" mt={2} mb={2}>
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </Box>
                  <Text fontWeight="bold">상품 판매 {totalSalesCount} 회</Text>
                </Flex>
                <Flex align="center">
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faBox} />
                  </Box>
                  <Text fontWeight="bold" mb={0}>
                    총 상품 수 {totalProductCount} 개
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Tab
            fontWeight={"bold"}
            height={"50px"}
            border={"1px solid #eee"}
            _selected={{
              backgroundColor: "teal",
              color: "white",
            }}
          >
            판매 목록
          </Tab>
          {userId == account.id && (
            <>
              <Tab
                height={"50px"}
                border={"1px solid #eee"}
                fontWeight={"bold"}
                _selected={{
                  backgroundColor: "teal",
                  color: "white",
                }}
              >
                찜 목록
              </Tab>
              <Tab
                fontWeight={"bold"}
                height={"50px"}
                border={"1px solid #eee"}
                _selected={{
                  backgroundColor: "teal",
                  color: "white",
                }}
              >
                입찰 내역
              </Tab>
              <Tab
                fontWeight={"bold"}
                height={"50px"}
                border={"1px solid #eee"}
                _selected={{
                  backgroundColor: "teal",
                  color: "white",
                }}
              >
                내 정보
              </Tab>
            </>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box>
              <MyShop />
            </Box>
          </TabPanel>
          {userId == account.id && (
            <TabPanel>
              <Box>
                <LikeList />
              </Box>
            </TabPanel>
          )}
          {userId == account.id && (
            <TabPanel>
              <Box>
                <BidList />
              </Box>
            </TabPanel>
          )}
          {userId == account.id && (
            <TabPanel>
              <Box>
                <UserInfo />
              </Box>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
