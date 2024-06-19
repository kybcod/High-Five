import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MyShop } from "./MyShop.jsx";
import { LikeList } from "./LikeList.jsx";
import axios from "axios";
import { UserInfo } from "./UserInfo.jsx";

export function MyPage({ tab }) {
  const [userNickName, setUserNickName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  // 탭 이름 -> 인덱스
  const tabIndex = {
    userInfo: 0,
    like: 1,
    shop: 2,
    bids: 3,
    reviews: 4,
  };

  // 인덱스 -> 택이름
  const indexTab = {
    0: "userInfo",
    1: "like",
    2: "shop",
    3: "bids",
    4: "reviews",
  };

  const currentTab = tab || "userInfo";

  useEffect(() => {
    axios.get(`/api/products/user/${userId}`).then((res) => {
      setUserNickName(res.data.userNickName);
    });

    const tabName = location.pathname.split("/").pop();
    if (!Object.keys(tabIndex).includes(tabName)) {
      navigate(`/myPage/${userId}`);
    }
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
            내 정보 확인
          </Tab>
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
            내 상점
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
            받은 후기
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box>
              <UserInfo />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <LikeList />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>
              <MyShop />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box>입찰 내역</Box>
          </TabPanel>
          <TabPanel>
            <Box>받은 후기</Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
