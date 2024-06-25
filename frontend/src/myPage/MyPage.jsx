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

  if (product === null) {
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
          <Box
            mb={4}
            w="100%"
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
          >
            <Flex justifyContent="center" align="center" p={4}>
              <Image
                src={user.profileImage.src}
                alt="상점 프로필 이미지"
                boxSize="100px"
                fallbackSrc="https://mblogthumb-phinf.pstatic.net/MjAyMDExMDFfMTgy/MDAxNjA0MjI4ODc1NDMw.Ex906Mv9nnPEZGCh4SREknadZvzMO8LyDzGOHMKPdwAg.ZAmE6pU5lhEdeOUsPdxg8-gOuZrq_ipJ5VhqaViubI4g.JPEG.gambasg/%EC%9C%A0%ED%8A%9C%EB%B8%8C_%EA%B8%B0%EB%B3%B8%ED%94%84%EB%A1%9C%ED%95%84_%ED%95%98%EB%8A%98%EC%83%89.jpg?type=w800"
                borderRadius="full"
                mr={4}
              />
              <Heading size="md">{product[0].userNickName}</Heading>
            </Flex>
            <Flex
              justify="space-between"
              p={4}
              borderTopWidth="1px"
              borderColor="gray.200"
            >
              <Flex flexDirection="column" alignItems="center" flex="1">
                <Flex align="center">
                  <Box mr={2}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </Box>
                  <Text fontWeight="bold" mb={0}>
                    상품 판매 {totalSalesCount} 회
                  </Text>
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
            border={"1px solid #eee"}
            borderRadius="3px"
            _selected={{ borderColor: "green.500", fontWeight: "bold" }}
          >
            판매 목록
          </Tab>
          {userId == account.id && (
            <>
              <Tab
                border={"1px solid #eee"}
                borderRadius="3px"
                _selected={{ borderColor: "green.500", fontWeight: "bold" }}
              >
                찜 목록
              </Tab>
              <Tab
                border={"1px solid #eee"}
                borderRadius="3px"
                _selected={{ borderColor: "green.500", fontWeight: "bold" }}
              >
                입찰 내역
              </Tab>
              <Tab
                border={"1px solid #eee"}
                borderRadius="3px"
                _selected={{ borderColor: "green.500", fontWeight: "bold" }}
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
