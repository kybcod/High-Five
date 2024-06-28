import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      <Flex mb={10} wrap="wrap" justify="center" gap={10} p={10}>
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
        {faq.map((item) => (
          <Box key={item.id} overflow="hidden">
            <Flex
              onClick={() => toggleExpand(item.id)}
              cursor="pointer"
              justifyContent="space-between"
              p={5}
              borderBottom="1px solid black"
            >
              <Box
                fontWeight="600"
                flex="1"
                textAlign="left"
                // fontSize={"1.1rem"}
              >
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
                <Box p={4} bg="#f5f5f5">
                  <Text whiteSpace={"pre-line"} m={"20px"} lineHeight={"1.8"}>
                    <Box as="span" fontWeight="bold">
                      A.
                    </Box>
                    <Box fontSize={"15px"} m={3} as={"span"}>
                      {item.content}
                    </Box>
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
