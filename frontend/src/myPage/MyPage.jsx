import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { useContext } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";
import { MyShop } from "./MyShop.jsx";
import { LikeList } from "./LikeList.jsx";

export function MyPage() {
  const account = useContext(LoginContext);
  return (
    <Box>
      <Heading mb={5} size={"lg"}>
        {account.nickName}
      </Heading>
      <Tabs variant="unstyled" orientation={"vertical"}>
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
            <Box>내정보</Box>
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
