import { useToast } from "@chakra-ui/react";

export const CustomToast = () => {
  const toast = useToast();

  const successToast = (message) => {
    toast({
      description: message,
      status: "success",
      position: "top",
      isClosable: true,
      duration: 3000,
      variant: "left-accent",
    });
  };

  const errorToast = (message) => {
    toast({
      description: message,
      status: "error",
      position: "top",
      isClosable: true,
      duration: 3000,
      variant: "left-accent",
    });
  };

  return { successToast, errorToast };
};
