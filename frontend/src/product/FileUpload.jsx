import { Box, Button, Flex, FormLabel, Image, Input } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

export function FileUpload({ files, setFiles, filePreview, setFilePreView }) {
  const fileInputRef = useRef(null);

  function handleChangeFiles(e) {
    const fileList = Array.from(e.target.files);
    const updatedFiles = [...files, ...fileList];
    setFiles(updatedFiles);

    const filePreviewList = updatedFiles.map((file, index) => {
      const uniqueKey = file.name + index;
      return (
        <Box
          mr={3}
          key={uniqueKey}
          id={uniqueKey}
          boxSize={"180px"}
          position="relative"
          minWidth="180px"
        >
          <Image boxSize={"180px"} mr={2} src={URL.createObjectURL(file)} />
          <Button
            position="absolute"
            top={1}
            right={2}
            variant="ghost"
            onClick={() => handleRemoveFile(uniqueKey, file)}
          >
            <FontAwesomeIcon icon={faCircleXmark} size="lg" />
          </Button>
        </Box>
      );
    });
    setFilePreView(filePreviewList);

    // 파일 인풋 초기화(같은 파일 선택 시 초기화)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveFile(fileKey, file) {
    setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    setFilePreView((prevPreviews) =>
      prevPreviews.filter((filePreview) => filePreview.key !== fileKey),
    );
  }

  return (
    <Box mb={4}>
      <Flex alignItems="center">
        <FormLabel htmlFor="file-upload">
          <Box
            border="1px dashed gray"
            textAlign="center"
            cursor="pointer"
            _hover={{ borderColor: "blue.500" }}
            mr={4}
            p={4}
            rounded="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            minW="180px" // 최소 너비 지정
            minH="180px" // 최소 높이 지정
          >
            <Box mb={2}>
              <FontAwesomeIcon icon={faCamera} size="2xl" />
            </Box>
            <Box>Upload files</Box>
            <Input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              multiple
              accept={"image/*"}
              style={{ display: "none" }}
              onChange={handleChangeFiles}
            />
          </Box>
        </FormLabel>
        <Flex overflowX="auto" flexWrap="nowrap" maxWidth="100%">
          {filePreview}
        </Flex>
      </Flex>
    </Box>
  );
}
