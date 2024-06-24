// import { Box, Button, Flex, FormLabel, Image, Input } from "@chakra-ui/react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCamera, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
// import { useRef } from "react";
//
// export function FileEdit({
//   files,
//   setFiles,
//   setExistingFilePreviews,
//   existingFilePreviews,
//   existingFiles,
//   setExistingFiles,
//   filePreviews,
//   setFilePreviews,
//   removedFileList,
//   setRemovedFileList,
// }) {
//   const fileInputRef = useRef(null);
//
//   function handleChangeFiles(e) {
//     const newSelectedFiles = Array.from(e.target.files);
//     const updatedFiles = [...files, ...newSelectedFiles];
//     setFiles(updatedFiles);
//
//     const newPreviews = newSelectedFiles.map((file) =>
//       URL.createObjectURL(file),
//     );
//     const updatedFilePreviews = [...filePreviews, ...newPreviews];
//     setFilePreviews(updatedFilePreviews);
//
//     // 파일 인풋 초기화(같은 파일 선택 시 초기화)
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   }
//
//   function handleRemoveFile(index) {
//     const updatedFiles = [...files];
//     updatedFiles.splice(index, 1);
//     setFiles(updatedFiles);
//
//     const updatedFilePreviews = [...filePreviews];
//     updatedFilePreviews.splice(index, 1);
//     setFilePreviews(updatedFilePreviews);
//   }
//
//   function handleRemoveExistingFile(index) {
//     const updatedExistingFiles = [...existingFiles];
//     const removedFile = updatedExistingFiles.splice(index, 1)[0]; // 삭제된 파일 정보 가져오기
//     setExistingFiles(updatedExistingFiles);
//
//     const updatedExistingFilePreviews = [...existingFilePreviews];
//     updatedExistingFilePreviews.splice(index, 1);
//     setExistingFilePreviews(updatedExistingFilePreviews);
//
//     // 삭제된 파일 리스트 업데이트
//     const updatedRemovedFileList = [...removedFileList, removedFile];
//     setRemovedFileList(updatedRemovedFileList);
//
//     // 삭제된 파일 리스트 콘솔 로그로 확인
//     console.log("Removed files:", updatedRemovedFileList);
//   }
//   return (
//     <Box mb={4}>
//       <Flex alignItems="center">
//         <FormLabel htmlFor="file-upload">
//           <Box
//             border="1px dashed gray"
//             textAlign="center"
//             cursor="pointer"
//             _hover={{ borderColor: "blue.500" }}
//             mr={4}
//             p={4}
//             rounded="md"
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             flexDirection="column"
//             minW="180px"
//             minH="180px"
//           >
//             <Box mb={2}>
//               <FontAwesomeIcon icon={faCamera} size="2xl" />
//             </Box>
//             <Box>Upload files</Box>
//             <Input
//               ref={fileInputRef}
//               id="file-upload"
//               type="file"
//               multiple
//               accept={"image/*"}
//               style={{ display: "none" }}
//               onChange={handleChangeFiles}
//             />
//           </Box>
//         </FormLabel>
//         <Flex overflowX="auto" flexWrap="nowrap" maxWidth="100%">
//           {existingFiles.map((file, index) => (
//             <Box
//               key={index} // 고유 키 설정
//               boxSize={"180px"}
//               position="relative"
//               minWidth="180px"
//               mr={2}
//             >
//               <Image boxSize={"180px"} src={file.filePath} />
//               <Button
//                 position="absolute"
//                 top={1}
//                 right={2}
//                 variant="ghost"
//                 onClick={() => handleRemoveExistingFile(index)}
//               >
//                 <FontAwesomeIcon icon={faCircleXmark} size="lg" />
//               </Button>
//             </Box>
//           ))}
//           {files.map((file, index) => (
//             <Box
//               key={index}
//               boxSize={"180px"}
//               position="relative"
//               minWidth="180px"
//               mr={2}
//             >
//               <Image boxSize={"180px"} src={URL.createObjectURL(file)} />
//               <Button
//                 position="absolute"
//                 top={1}
//                 right={2}
//                 variant="ghost"
//                 onClick={() => handleRemoveFile(index)}
//               >
//                 <FontAwesomeIcon icon={faCircleXmark} size="lg" />
//               </Button>
//             </Box>
//           ))}
//         </Flex>
//       </Flex>
//     </Box>
//   );
// }
