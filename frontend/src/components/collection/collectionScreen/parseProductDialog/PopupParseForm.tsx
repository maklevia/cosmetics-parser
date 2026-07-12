import { ErrorView } from "@/components/collection/collectionScreen/parseProductDialog/views/ErrorView";
import { LinkInputView } from "@/components/collection/collectionScreen/parseProductDialog/views/LinkInputView";
import { ParsedProductsView } from "@/components/collection/collectionScreen/parseProductDialog/views/ParsedProductsView";
import { ParseLoadingView } from "@/components/collection/collectionScreen/parseProductDialog/views/ParseLoadingView";
import { useParserByLink } from "@/components/collection/collectionScreen/parseProductDialog/hooks/useParserByLink";
import { createOverlay, Dialog, DialogRoot, Portal } from "@chakra-ui/react";
import { useState } from "react";

export const parseDialog = createOverlay((props) => {
  const [productLink, setProductLink] = useState("");
  const { isLoading, parse, results, productId,errorMessage } = useParserByLink();

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
            ) : results ? (
              <ParsedProductsView parseResult={results} productId={productId}/>
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
