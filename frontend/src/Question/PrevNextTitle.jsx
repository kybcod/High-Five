import { Box, Flex, Image } from "@chakra-ui/react";

export function PrevNextTitle({
  secret,
  hasAccess,
  isAdmin,
  title,
  userId,
  navigateTo,
}) {
  return (
    <Box
      ml={3}
      cursor="pointer"
      onClick={() => {
        navigateTo();
        window.scrollTo({ top: 240 });
      }}
    >
      {secret ? (
        <Flex gap={2}>
          <Image src={"/img/lock.svg"} />
          {!hasAccess(userId) && !isAdmin() ? (
            <span style={{ color: "gray", fontSize: "14px" }}>비밀글</span>
          ) : (
            <span style={{ color: "black", fontSize: "14px" }}>{title}</span>
          )}
        </Flex>
      ) : (
        <span style={{ fontSize: "14px" }}>{title}</span>
      )}
    </Box>
  );
}
