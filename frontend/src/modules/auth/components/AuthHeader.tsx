import { Heading, VStack, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@fe/components/ui/color-mode";

interface Props {
  title: string;
  subtitle: string;
}

export function AuthHeader(props: Props) {
  const { title, subtitle } = props;

  const headingColor = useColorModeValue("gray.800", "gray.100");
  const subtextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <VStack gap={1}>

      <Heading size="2xl" color={headingColor} fontWeight="700">
        {title}
      </Heading>

      <Text color={subtextColor} fontSize="sm">
        {subtitle}
      </Text>
      
    </VStack>
  );
}
