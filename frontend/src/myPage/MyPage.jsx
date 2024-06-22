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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MyShop } from "./MyShop.jsx";
import { LikeList } from "./LikeList.jsx";
import axios from "axios";
import { UserInfo } from "./UserInfo.jsx";
import { BidList } from "./BidList.jsx";
import { LoginContext } from "../component/LoginProvider.jsx";

export function MyPage({ tab }) {
  const [userNickName, setUserNickName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();
  const account = useContext(LoginContext);

  const [tabIndex, setTabIndex] = useState({});
  const [indexTab, setIndexTab] = useState({});
  const [currentTab, setCurrentTab] = useState("userInfo");

  useEffect(() => {
    axios.get(`/api/products/user/${userId}`).then((res) => {
      setUserNickName(res.data.userNickName);
    });

    const tabName = location.pathname.split("/").pop();
    const initialTab = tabName || "userInfo";
    setCurrentTab(initialTab);
  }, [location.pathname, userId]);

  useEffect(() => {
    const tabMapping = {};
    const reverseTabMapping = {};
    let idx = 0;

    if (userId == account.id) {
      tabMapping["userInfo"] = idx;
      reverseTabMapping[idx] = "userInfo";
      idx++;
      tabMapping["like"] = idx;
      reverseTabMapping[idx] = "like";
      idx++;
    }

    tabMapping["shop"] = idx;
    reverseTabMapping[idx] = "shop";
    idx++;

    if (userId == account.id) {
      tabMapping["bids"] = idx;
      reverseTabMapping[idx] = "bids";
      idx++;
    }

    tabMapping["reviews"] = idx;
    reverseTabMapping[idx] = "reviews";

    setTabIndex(tabMapping);
    setIndexTab(reverseTabMapping);
  }, [userId, account]);

  const handleTabsChange = (index) => {
    const tabName = indexTab[index];
    navigate(`/myPage/${userId}/${tabName}`);
    setCurrentTab(tabName); // 상태 업데이트
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
          {userId == account.id && (
            <>
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
            </>
          )}
          <Tab
            border={"1px solid #eee"}
            borderRadius="3px"
            _selected={{ borderColor: "green.500", fontWeight: "bold" }}
          >
            내 상점
          </Tab>
          {userId == account.id && (
            <Tab
              border={"1px solid #eee"}
              borderRadius="3px"
              _selected={{ borderColor: "green.500", fontWeight: "bold" }}
            >
              입찰 내역
            </Tab>
          )}
          <Tab
            border={"1px solid #eee"}
            borderRadius="3px"
            _selected={{ borderColor: "green.500", fontWeight: "bold" }}
          >
            받은 후기
          </Tab>
        </TabList>
        <TabPanels>
          {userId == account.id && (
            <TabPanel>
              <Box>
                <UserInfo />
              </Box>
            </TabPanel>
          )}
          {userId == account.id && (
            <TabPanel>
              <Box>
                <LikeList />
              </Box>
            </TabPanel>
          )}
          <TabPanel>
            <Box>
              <MyShop />
            </Box>
          </TabPanel>
          {userId == account.id && (
            <TabPanel>
              <Box>
                <BidList />
              </Box>
            </TabPanel>
          )}
          <TabPanel>
            <Box>받은 후기</Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
