import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text, Flex, Button, Divider, Spinner } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Scroll from "./Scroll.jsx";

export function FAQ() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const [faq, setFaq] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/question/faq?category=${category}`)
      .then((res) => {
        setFaq(res.data.faqList);
        setCategories(res.data.categories);
      })
      .catch((error) => console.error(error));
  }, [category]);

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      if (prev.includes(id)) {
        return prev.filter((expandedId) => expandedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  if (faq === null) {
    return <Spinner />;
  }

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory });
    setExpanded([]);
  };

  return (
    <Box>
      <Flex mb={10} p={5} wrap="wrap" justify="center" gap={12}>
        <Button
          borderRadius={"unset"}
          w={150}
          h={50}
          onClick={() => handleCategoryChange("all")}
          sx={{
            bg: category === "all" ? "black" : "none",
            color: category === "all" ? "white" : "black",
            border: category === "all" ? "none" : "2px solid black",
          }}
        >
          전체
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            borderRadius={"unset"}
            w={150}
            h={50}
            sx={{
              bg: category == cat.id ? "black" : "none",
              color: category == cat.id ? "white" : "black",
              border: category == cat.id ? "none" : "2px solid black",
            }}
          >
            {cat.name}
          </Button>
        ))}
      </Flex>
      <Flex direction="column" w="100%">
        <Divider orientation="horizontal" borderColor={"black"} />
        {faq.map((item) => (
          <Box key={item.id} overflow="hidden">
            <Flex
              onClick={() => toggleExpand(item.id)}
              cursor="pointer"
              justifyContent="space-between"
              p={5}
              borderBottom="1px solid black"
            >
              <Box fontWeight="600" flex="1" textAlign="left">
                Q. {item.title}
              </Box>
              <Box flex="0">
                {expanded.includes(item.id) ? (
                  <FontAwesomeIcon icon={faChevronUp} />
                ) : (
                  <FontAwesomeIcon icon={faChevronDown} />
                )}
              </Box>
            </Flex>
            <Box
              maxHeight={expanded.includes(item.id) ? "1000px" : "0"}
              overflow="hidden"
              transition="max-height 1s ease-in-out"
            >
              {expanded.includes(item.id) && (
                <Flex p={4} bg="#f5f5f5">
                  <Box as="span" fontWeight="bold" ml={3} mt={5}>
                    A.
                  </Box>
                  <Text whiteSpace={"pre-line"} m={5} lineHeight={"1.8"}>
                    <Box fontSize={"15px"} as={"span"}>
                      {item.content}
                    </Box>
                  </Text>
                </Flex>
              )}
            </Box>
          </Box>
        ))}
      </Flex>
      <Scroll isTop={true} />
    </Box>
  );
}
