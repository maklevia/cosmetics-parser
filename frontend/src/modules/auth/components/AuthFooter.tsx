import { HStack, Link as LinkUI, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@fe/components/ui/color-mode";

interface Props {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: Props) {
  const textColor = useColorModeValue("gray.500", "gray.400");
  const linkColor = useColorModeValue(
    "rgba(196, 159, 152, 1)",
    "rgba(210, 170, 162, 1)"
  );
  const linkHoverColor = useColorModeValue(
    "rgba(210, 170, 162, 1)",
    "rgba(230, 195, 188, 1)"
  );

  return (
    <HStack justifyContent="center" pt={2}>

      <Text fontSize="sm" color={textColor}>
        {text}
      </Text>

      <LinkUI
        href={href}
        fontSize="sm"
        color={linkColor}
        _hover={{ color: linkHoverColor, textDecoration: "underline" }}
        fontWeight="500"
      >
        {linkText}
      </LinkUI>
      
    </HStack>
  );
}
