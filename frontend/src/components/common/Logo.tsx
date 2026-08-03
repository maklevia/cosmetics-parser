import { HStack, Image, Text } from "@chakra-ui/react";
import "@fontsource/cinzel/600.css";

interface Props {
  fontSize: string;
  onLogoClick?: () => void;
}

export function Logo(props: Props) {
  const { fontSize, onLogoClick } = props;

  return (
    <HStack
      gap={2}
      cursor={onLogoClick ? "pointer" : "default"}
      onClick={onLogoClick}
    >
      <Image src="/logo.PNG" alt="Logo" boxSize="45px" objectFit="contain" />

      <Text
        fontSize={fontSize}
        bgImage="linear-gradient(90deg, rgba(156, 111, 111) 0%, rgb(112, 79, 79) 100%)"
        bgClip="text"
        color="transparent"
        textTransform="uppercase"
        fontFamily="'Cinzel', serif"
      >
        Cosmetics Parser
      </Text>
    </HStack>
  );
}
