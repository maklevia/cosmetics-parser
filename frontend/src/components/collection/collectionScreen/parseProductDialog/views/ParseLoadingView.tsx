import { Spinner, VStack, Text, DialogBody } from "@chakra-ui/react";

export function ParseLoadingView() {
  return (
    <DialogBody>
      <VStack colorPalette="pink">
        <Spinner />
        <Text>Searching for your product...</Text>
      </VStack>
    </DialogBody>
  );
}
