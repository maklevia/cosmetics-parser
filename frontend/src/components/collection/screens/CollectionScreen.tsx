import { CollectionArea } from "@/components/collection/screens/CollectionArea/CollectionArea";
import { parseDialog } from "@/components/collection/screens/ParsePopupForm/PopupParseForm";
import { Button, Card, Center, VStack } from "@chakra-ui/react";
import { useState } from "react";

export function CollectionScreen() {
  //used to update collection when user adds new product
  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <Center>
      <VStack>
        <Card.Root marginBottom='10px'>
          <Card.Body width="md" gap="2px">
            <Card.Title>Search product</Card.Title>
            <Card.Description>
              Click on the button below to find out prices for your product
            </Card.Description>
          </Card.Body>
          <Card.Footer justifyContent="center">
            <Button onClick={() => parseDialog.open("a", {setRefreshCount})}>+</Button>
          </Card.Footer>
        </Card.Root>
        <parseDialog.Viewport />

        <CollectionArea refreshCount={refreshCount} setRefreshCount={setRefreshCount}/>
      </VStack>
    </Center>
  );
}
