import { ErrorView } from "@/components/collection/screens/ParsePopupForm/components/ErrorView";
import { LinkInputView } from "@/components/collection/screens/ParsePopupForm/components/LinkInputView";
import { ParsedProductsView } from "@/components/collection/screens/ParsePopupForm/components/ParsedProductsView";
import { ParseLoadingView } from "@/components/collection/screens/ParsePopupForm/components/ParseLoadingView";
import { useParserByLink } from "@/components/collection/screens/ParsePopupForm/hooks/useParserByLink";
import { createOverlay, Dialog, DialogRoot, Portal } from "@chakra-ui/react";
import { useState } from "react";

export const parseDialog = createOverlay((props) => {
  const [productLink, setProductLink] = useState("");
  const { isLoading, parse, results, productId, errorMessage } = useParserByLink();
  const setRefreshCount = props.setRefreshCount;

  const handleFetch = () => {
    parse(productLink);
  };

  return (
    <DialogRoot {...props} placement="center" size={results ? "xl" : "md"}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {isLoading ? (
              <ParseLoadingView />
            ) : errorMessage ? (
              <ErrorView errorMessage={errorMessage} />
            ) : results && productId ? (
              <ParsedProductsView parseResult={results} productId={productId} setRefreshCount={setRefreshCount}/>
            ) : (
              <LinkInputView
                onChangeFunc={setProductLink}
                onClickFunc={handleFetch}
              ></LinkInputView>
            )}
          </Dialog.Content>
          <Dialog.CloseTrigger />
        </Dialog.Positioner>
      </Portal>
    </DialogRoot>
  );
});
