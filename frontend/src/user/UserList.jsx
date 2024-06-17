import {
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
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export function UserList() {
  const [userList, setUserList] = useState(null);
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState({});
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchParams] = useSearchParams();

  // TODO. 주석 해제
  // useEffect(() => {
  //   axios.get(`/api/users/list?${searchParams}`).then((res) => {
  //     setUserList(res.data.userList);
  //     setPageInfo(res.data.pageInfo);
  //     setSearchType("all");
  //     setSearchKeyword("");
  //     const typeParam = searchParams.get("type");
  //     const keywordParam = searchParams.get("keyword");
  //     if (typeParam) {
  //       setSearchType(typeParam);
  //     }
  //     if (keywordParam) {
  //       setSearchKeyword(keywordParam);
  //     }
  //   });
  // }, [searchParams]);

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

  // function handleTypeClick(type) {
  //   setSearchType(type);
  //   navigate(`/user/list/?type=${searchType}&keyword=${searchKeyword}`);
  // }

  return (
    <Box>
      <Flex gap={2}>
        {/*<Link cursor={"pointer"} onClick={() => handleTypeClick("all")}>*/}
        {/*  전체*/}
        {/*</Link>*/}
        {/*<Link cursor={"pointer"} onClick={() => handleTypeClick("black")}>*/}
        {/*  블랙회원*/}
        {/*</Link>*/}
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Email</Th>
            <Th>Name</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userList.map((user) => (
            <Tr key={user.id}>
              <Td>{user.id}</Td>
              <Td>{user.email}</Td>
              <Td>{user.nickName}</Td>
              <Td>{user.signupDateAndTime}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Center mb={10}>
        <Flex gap={1}>
          <Box>
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색어"
            />
          </Box>
          <Box>
            <Button onClick={handleSearchClick}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Box>
        </Flex>
      </Center>
      <Center gap={3}>
        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            _selected={{ borderColor: "green.500", fontWeight: "bold" }}
            onClick={() => handlePageButtonClick(pageNumber)}
          >
            {pageNumber}
          </Link>
        ))}
      </Center>
    </Box>
  );
}
