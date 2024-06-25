import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
export function FAQ() {
  const [category, setCatecory] = useState("all");
  const [expanded, setExpanded] = useState([]);
  const [faq, setFaq] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/question/faq`)
      .then((res) => setFaq(res.data))
      .catch();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => {
      if (prev.includes(id)) {
        return prev.filter((expandedId) => expandedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <>
      <Heading>FAQ</Heading>
      {faq.map((item) => (
        <Box
          key={item.id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          my={2}
        >
          <Button variant="link" onClick={() => toggleExpand(item.id)}>
            <Heading size="md">{item.title}</Heading>
          </Button>
          {expanded.includes(item.id) && <Text mt={4}>{item.content}</Text>}
        </Box>
      ))}
    </>
  );
}
