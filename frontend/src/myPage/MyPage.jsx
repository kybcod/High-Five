import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyShop } from "./MyShop.jsx";
import { LikeList } from "./LikeList.jsx";
import axios from "axios";
import { UserInfo } from "./UserInfo.jsx";
import { BidList } from "./BidList.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";

export function MyPage({ tab }) {
  const [userNickName, setUserNickName] = useState("");
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
      setUserNickName(res.data.userNickName);
    });
  }, []);

  const handleTabsChange = (index) => {
    navigate(`/myPage/${userId}/${indexTab[index]}`);
  };

  return (
    <Box>
      <Heading mb={5} size={"lg"}>
        {userNickName}
      </Heading>
      <Tabs
        variant="unstyled"
        orientation={"vertical"}
        index={tabIndex[currentTab]}
        onChange={handleTabsChange}
      >
        <TabList w={"30%"} m={3} mr={20}>
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
