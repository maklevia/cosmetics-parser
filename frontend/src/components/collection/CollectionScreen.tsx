import { parseDialog } from "@/components/collection/collectionScreen/parseProductDialog/PopupParseForm";
import { AbsoluteCenter, Button, Card } from "@chakra-ui/react";

export function CollectionScreen() {
  return (
    <AbsoluteCenter>
      <Card.Root>

        <Card.Body width="md" gap="2px">
          <Card.Title>Fetch product</Card.Title>

          <Card.Description>
            Click on the button below to find out prices for your product
          </Card.Description>
        </Card.Body>

        <Card.Footer justifyContent="center">
          <Button onClick={() => parseDialog.open('a', {})}>+</Button>
        </Card.Footer>
        
      </Card.Root>
      <parseDialog.Viewport />
    </AbsoluteCenter>
  );
}
