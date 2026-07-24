import { Dialog, Stack, Text, Input, Button } from "@chakra-ui/react";

interface ComponentInput {
    onChangeFunc: (link: string) => void;
    onClickFunc: () => void;
}

export function LinkInputView({onChangeFunc, onClickFunc}: ComponentInput) {
  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Discover prices for your product</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Stack>
          <Text>Paste the link for your product</Text>
          <Input onChange={(e) => onChangeFunc(e.target.value)} />
          <Button onClick={onClickFunc}>Search product</Button>
        </Stack>
      </Dialog.Body>
    </>
  );
}
