import { submitOnEnter } from "@fe/utils/submitOnEnterUtil";
import { Dialog, Stack, Text, Input, Button } from "@chakra-ui/react";

interface ComponentInput {
    onChangeFunc: (link: string) => void;
    onClickFunc: () => void;
}

export function LinkInputView({onChangeFunc, onClickFunc}: ComponentInput) {

const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  onChangeFunc(e.target.value)
}

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  submitOnEnter(e, onClickFunc)
}

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Discover prices for your product</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
          <Stack>
          <Text>Paste the link for your product</Text>
          <Input 
            onChange={(e) => onInputChange(e)}
            onKeyDown={(e) => onKeyDown(e)}
           />
          <Button onClick={onClickFunc}>Search product</Button>
        </Stack>
      </Dialog.Body>
    </>
  );
}
