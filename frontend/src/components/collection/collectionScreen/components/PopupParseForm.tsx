import { useParserByLink } from "@/components/collection/collectionScreen/hooks/useParserByLink";
import {
  createOverlay,
  Dialog,
  Stack,
  Text,
  Input,
  Button,
  DialogRoot,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";

export const parseDialog = createOverlay((props) => {
  const [productLink, setProductLink] = useState("");
  const { isLoading, parse, results } = useParserByLink();

  const handleFetch = () => {
    parse(productLink);
  };

  return (
    <DialogRoot {...props} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Discover prices for your product</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack>
                <Text>Paste the link for your product</Text>
                <Input onChange={(e) => setProductLink(e.target.value)} />
                <Button onClick={handleFetch}>Fetch</Button>
              </Stack>
            </Dialog.Body>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </DialogRoot>
  );
});
