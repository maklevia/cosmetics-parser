import { Box, Flex, Image } from "@chakra-ui/react";
import { useColorModeValue } from "@fe/components/ui/color-mode";
import { FiTag } from "react-icons/fi";

interface Props {
  image?: string;
}

export function NotificationThumbnail({ image }: Props) {
  const placeholderBg = useColorModeValue("gray.50", "whiteAlpha.100");

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
          bg={placeholderBg}
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
