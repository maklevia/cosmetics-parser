import { CollectionArea } from "@fe/modules/collection/components/CollectionArea/CollectionArea";
import { Container, Stack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { productsDialog } from "@fe/modules/collection/components/ProductsDialog";
import { ParseLinkInput } from "@fe/modules/collection/components/ParseForm/ParseLinkInput";

export function CollectionScreen() {
  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <Container maxW="5xl" pt={4} pb={10}>
      <Stack gap={10}>
        <VStack align="flex-start" gap={4}>
          <ParseLinkInput setRefreshCount={setRefreshCount} />
        </VStack>

        <CollectionArea
          refreshCount={refreshCount}
          setRefreshCount={setRefreshCount}
        />
      </Stack>
    </Container>
  );
}
