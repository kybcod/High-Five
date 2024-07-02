import { Box, Center, Flex, Heading, Image, Text } from "@chakra-ui/react";

export default function Footer(props) {
  return (
    <Box
      h={"100px"}
      borderTop={"1px solid black"}
      p={4}
      align="center"
      fontSize={"lg"}
      sx={{
        bottom: 0,
        textAlign: "center",
        backgroundColor: "white",
      }}
    >
      <Box>
        <Flex justify={"space-between"}>
          <Box ml={7}>
            <Heading>HIGH-FIVE</Heading>
            <Text fontSize={"lg"}>Function</Text>
          </Box>
          <Box mr={4}>
            <Flex gap={5}>
              <Box w={"70px"}>
                <Text as={"u"}>DAHEE</Text>
                <Text>CHAT</Text>
              </Box>
              <Box w={"90px"}>
                <Text as={"u"}>YEBEEN</Text>
                <Text>PRODUCT</Text>
              </Box>
              <Box w={"60px"}>
                <Text as={"u"}>JINA</Text>
                <Text>USER</Text>
              </Box>
              <Box w={"120px"}>
                <Text as={"u"}>HWAYEONG</Text>
                <Text>QNA</Text>
              </Box>
              <Box w={"120px"}>
                <Text as={"u"}>JEONGYUN</Text>
                <Text>BOARD</Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Center mt={1}>
          <Box>
            <Center>
              <Text>Visit Our GitHub!</Text>
            </Center>
            <Flex gap={5} mt={2}>
              <a href="https://github.com/huitopia">
                <Flex alignItems="center" direction="column">
                  <Image
                    src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdW2yWu%2FbtsIhOwAXAC%2FmgKqY0dUU78WrR2kHOXtm1%2Fimg.png"
                    width={"30px"}
                  />
                  <Text fontSize={"xs"} color="red">
                    DH
                  </Text>
                </Flex>
              </a>
              <a href="https://github.com/kybcod">
                <Flex alignItems="center" direction="column">
                  <Image
                    src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdW2yWu%2FbtsIhOwAXAC%2FmgKqY0dUU78WrR2kHOXtm1%2Fimg.png"
                    width={"30px"}
                  />
                  <Text fontSize={"xs"} color="orange">
                    YB
                  </Text>
                </Flex>
              </a>
              <a href="https://github.com/jnn-jnn1">
                <Flex alignItems="center" direction="column">
                  <Image
                    src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdW2yWu%2FbtsIhOwAXAC%2FmgKqY0dUU78WrR2kHOXtm1%2Fimg.png"
                    width={"30px"}
                  />
                  <Text fontSize={"xs"} color="green">
                    JA
                  </Text>
                </Flex>
              </a>
              <a href="https://github.com/kiwi85547">
                <Flex alignItems="center" direction="column">
                  <Image
                    src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdW2yWu%2FbtsIhOwAXAC%2FmgKqY0dUU78WrR2kHOXtm1%2Fimg.png"
                    width={"30px"}
                  />
                  <Text fontSize={"xs"} color={"blue"}>
                    HY
                  </Text>
                </Flex>
              </a>
              <a href="https://github.com/JeongYunheo">
                <Flex alignItems="center" direction="column">
                  <Image
                    src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdW2yWu%2FbtsIhOwAXAC%2FmgKqY0dUU78WrR2kHOXtm1%2Fimg.png"
                    width={"30px"}
                  />
                  <Text fontSize={"xs"} color={"purple"}>
                    JY
                  </Text>
                </Flex>
              </a>
            </Flex>
          </Box>
        </Center>
        <Center mt={1} fontSize={"xs"}>
          <Text>Copyright ©2024 Designed by HIGH-FIVE</Text>
        </Center>
      </Box>
    </Box>
  );
}
