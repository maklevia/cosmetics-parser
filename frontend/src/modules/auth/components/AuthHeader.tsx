import { Heading, VStack, Text } from "@chakra-ui/react";

interface Props {
  title: string;
  subtitle: string;
}

export function AuthHeader(props: Props) {
  const { title, subtitle } = props;

  return (
    <VStack gap={1}>

      <Heading size="2xl" color="gray.800" _dark={{ color: "gray.100" }} fontWeight="700">
        {title}
      </Heading>

      <Text color="gray.500" _dark={{ color: "gray.400" }} fontSize="sm">
        {subtitle}
      </Text>
      
    </VStack>
  );
}
