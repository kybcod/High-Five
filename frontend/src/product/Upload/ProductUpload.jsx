import { Box, Button, Divider, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUpload } from "./FileUpload.jsx";
import { FormFields } from "../../component/FormFields.jsx";

export function ProductUpload() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreView] = useState([]);
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleUploadClick() {
    setLoading(true);

    const currentDateTime = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    if (selectedDateTime < currentDateTime) {
      toast({
        status: "warning",
        description:
          "선택한 시간이 현재 시간보다 이전입니다. 다시 선택해주세요.",
        position: "top-right",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    if (files.length === 0) {
      toast({
        status: "warning",
        description: "파일을 업로드 해주세요.",
        position: "top-right",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    if (!title) {
      toast({
        status: "warning",
        description: "제목을 입력해주세요.",
        position: "top-right",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    if (!category) {
      toast({
        status: "warning",
        description: "카테고리를 선택해주세요.",
        position: "top-right",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    if (!startPrice) {
      toast({
        status: "warning",
        description: "입찰 시작가를 입력해주세요.",
        position: "top-right",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    if (!date || !time) {
      toast({
        status: "warning",
        description: "입찰 마감 시간을 입력해주세요.",
        position: "top-right",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    // endTime : Date, time으로 나누기
    const localDate = new Date(`${date}T${time}`);
    localDate.setHours(localDate.getHours() + 9);
    const formattedEndTime = localDate.toISOString().slice(0, -5);

    axios
      .postForm("/api/products", {
        title: title,
        category: category,
        startPrice: startPrice,
        endTime: formattedEndTime,
        content: content,
        files: files,
      })
      .then(() => {
        toast({
          description: "새 상품이 등록되었습니다. 지금부터 판매 시작합니다.",
          status: "success",
          position: "top-right",
          duration: 3000,
        });
        navigate("/list");
      })
      .catch((err) => {
        if (err.response && err.response.status === 413) {
          toast({
            status: "error",
            description: `파일이 너무 큽니다. 다른 파일을 선택해주세요.`,
            position: "top-right",
            duration: 3000,
          });
        } else {
          toast({
            status: "error",
            description: `서버 오류가 발생했습니다. 다시 시도해주세요.`,
            position: "top-right",
            duration: 3000,
          });
        }
      })
      .finally(() => setLoading(false));
  }

  return (
    <Box>
      <Text
        mx="auto"
        maxWidth="1000px"
        fontSize={"2xl"}
        fontWeight={"bold"}
        mb={4}
      >
        상품 등록
      </Text>
      <Divider border={"1px solid black"} mx="auto" maxWidth="1000px" my={4} />
      <Box mx="auto" maxWidth="1000px">
        <FileUpload
          files={files}
          setFiles={setFiles}
          filePreview={filePreview}
          setFilePreView={setFilePreView}
        />
        <FormFields
          title={title}
          setTitle={setTitle}
          category={category}
          setCategory={setCategory}
          startPrice={startPrice}
          setStartPrice={setStartPrice}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          content={content}
          setContent={setContent}
        />
        <Box mt={6} textAlign="end">
          <Button
            w={"20%"}
            h={"50px"}
            fontSize={"lg"}
            isLoading={loading}
            type="submit"
            borderWidth={3}
            variant={"outline"}
            colorScheme={"teal"}
            onClick={handleUploadClick}
          >
            상품 업로드
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
