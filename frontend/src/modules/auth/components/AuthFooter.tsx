import { HStack, Link as LinkUI, Text } from "@chakra-ui/react";

interface Props {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: Props) {
  return (
    <HStack justifyContent="center" pt={2}>

      <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
        {text}
      </Text>

      <LinkUI
        href={href}
        fontSize="sm"
        color="rgba(196, 159, 152, 1)"
        _dark={{ color: "brand.muted" }}
        _hover={{ color: "brand.muted", _dark: { color: "rgba(230, 195, 188, 1)" }, textDecoration: "underline" }}
        fontWeight="500"
      >
        {linkText}
      </LinkUI>
      
    </HStack>
  );
}
