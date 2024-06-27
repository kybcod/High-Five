import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";

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

  const handleCategoryChange = (newCategory) => {
    setSearchParams({ category: newCategory });
    setExpanded([]);
  };

  return (
    <Box>
      <Flex mb={10} wrap="wrap" justify="center">
        <Button
          onClick={() => handleCategoryChange("all")}
          m={2}
          colorScheme="teal"
          variant={category === "all" ? "solid" : "outline"}
        >
          전체
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            m={2}
            colorScheme="teal"
            variant={category === "cat.id" ? "solid" : "outline"}
          >
            {cat.name}
          </Button>
        ))}
      </Flex>
      <Flex direction="column" w="100%">
        {faq.map((item) => (
          <Box key={item.id} borderBottom="1px solid #e8e8e8" overflow="hidden">
            <Flex
              onClick={() => toggleExpand(item.id)}
              cursor="pointer"
              justifyContent="space-between"
              p={6}
              borderBottom="1px solid #e8e8e8"
            >
              <Box fontWeight="bold" flex="1" textAlign="left">
                Q. {item.title}
              </Box>
              <Box flex="0">
                {expanded.includes(item.id) ? (
                  <TriangleUpIcon />
                ) : (
                  <TriangleDownIcon />
                )}
              </Box>
            </Flex>
            <Box
              maxHeight={expanded.includes(item.id) ? "1000px" : "0"}
              overflow="hidden"
              transition="max-height 1s ease-in-out"
            >
              {expanded.includes(item.id) && (
                <Box p={4} bg="gray.100">
                  <Text whiteSpace={"pre-line"} m={"20px"}>
                    A. {item.content}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
