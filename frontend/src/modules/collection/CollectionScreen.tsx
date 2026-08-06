import { CollectionArea } from "@fe/modules/collection/components/CollectionArea/CollectionArea";
import { Container, Stack, VStack } from "@chakra-ui/react";
import { ParseLinkInput } from "@fe/modules/collection/components/ParseForm/ParseLinkInput";

export function CollectionScreen() {
  return (
    <Container maxW="5xl" pt={4} pb={10}>
      <Stack gap={10}>
        <VStack align="flex-start" gap={4}>
          <ParseLinkInput />
        </VStack>

        <CollectionArea />
      </Stack>
    </Container>
  );
}
