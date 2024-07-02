import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export function UserList() {
  const [userList, setUserList] = useState(null);
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios.get(`/api/users/list?${searchParams}`).then((res) => {
      setUserList(res.data.userList);
      setPageInfo(res.data.pageInfo);
    });

    setSearchType("all");
    setSearchKeyword("");
    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]);

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers.push(i);
  }

  if (userList === null) {
    return <Spinner />;
  }

  function handlePageButtonClick(pageNumber) {
    searchParams.set("page", pageNumber);
    navigate(`/user/list/?${searchParams}`);
  }

  function handleSearchClick() {
    navigate(`/user/list/?type=${searchType}&keyword=${searchKeyword}`);
  }

  function handleTypeClick(type) {
    navigate(`/user/list/?type=${type}&keyword=${searchKeyword}`);
  }

  return (
    <Box>
      <Flex gap={2}>
        <Link cursor={"pointer"} onClick={() => handleTypeClick("all")}>
          전체보기
        </Link>
        <Link cursor={"pointer"} onClick={() => handleTypeClick("black")}>
          블랙회원
        </Link>
      </Flex>
      <Table mt={5}>
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>이메일</Th>
            <Th>닉네임</Th>
            <Th>가입일시</Th>
            <Th>신고누적횟수</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userList.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>
                {user.email}
                {user.authority.includes("admin") && (
                  <Badge ml={"10px"} variant={"outline"} w={"45px"}>
                    관리자
                  </Badge>
                )}
              </Td>
              <Td>{user.nickName}</Td>
              <Td>{user.signupDateAndTime.substring(0, 13)}</Td>
              <Td>{user.blackCount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Center mb={10} mt={10}>
        <Flex gap={1}>
          <Box>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어"
            />
          </Box>
          <Box>
            <Button
              onClick={handleSearchClick}
              variant={"outline"}
              colorScheme={"teal"}
              border={"2px"}
            >
              검색
            </Button>
          </Box>
        </Flex>
      </Center>
      <Center gap={3}>
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            borderWidth={2}
            _selected={"teal"}
            colorScheme={
              pageNumber - 1 === pageInfo.currentPageNumber ? "teal" : "gray"
            }
            variant="outline"
            onClick={() => handlePageButtonClick(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
      </Center>
    </Box>
  );
}
