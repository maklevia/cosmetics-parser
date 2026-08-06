import { Box, Flex, Image } from "@chakra-ui/react";
import { FiTag } from "react-icons/fi";

interface Props {
  image?: string;
}

export function NotificationThumbnail({ image }: Props) {
  return (
    <Box flexShrink={0}>
      {image ? (
        <Image
          src={image}
          alt="Product Thumbnail"
          boxSize="44px"
          objectFit="cover"
          borderRadius="lg"
          boxShadow="sm"
        />
      ) : (
        <Flex
          boxSize="44px"
          bg="gray.50"
          _dark={{ bg: "whiteAlpha.100" }}
          borderRadius="lg"
          align="center"
          justify="center"
          color="fg.muted"
          boxShadow="sm"
        >
          <FiTag size={20} />
        </Flex>
      )}
    </Box>
  );
}
