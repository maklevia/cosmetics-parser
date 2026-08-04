import { createOverlay, Dialog, Portal, Button, HStack, Box, Text } from "@chakra-ui/react";
import { ProductStoreRecordsCard } from "./ProductStoreRecordsCard";
import type { ParseResult, ProductRecord } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import type { StoreName } from "@fe/types/store.typedefs";
import { formatStoreName } from "@fe/utils/stringUtils";
import { useAddProductToCollection } from "@fe/modules/collection/components/ParseForm/hooks/useAddProductToCollection";
import { useProductDetails } from "@fe/modules/collection/components/CollectionArea/hooks/useProductDetails";
import { deleteProductDialog } from "@fe/modules/collection/components/CollectionArea/components/DeleteProductDialog";
import { toaster } from "@fe/components/ui/toaster";
import { DialogCloseTrigger } from "@fe/components/ui/dialog";
import { useEffect, useRef } from "react";

interface Props {
  mode: "add" | "delete";
  productId: number;
  parseResult?: ParseResult;
  setRefreshCount?: React.Dispatch<React.SetStateAction<number>>;
}

export const productsDialog = createOverlay((props: Props) => {
  const { mode, productId, parseResult, setRefreshCount } = props;
  const { isLoading: isLoadingDetails, productDetails, showDetails } = useProductDetails();
  
  const { add, isLoading: isAdding } = useAddProductToCollection({
    productId,
    onSuccess: () => {
      setRefreshCount?.((prev) => prev + 1);
      toaster.update("add", { title: "Product successfully saved in your Collection", type: "success" });
      productsDialog.close("a");
    },
    onFailure: (message) => {
      setTimeout(() => toaster.update("add", { title: message, type: "error" }));
    }
  });

  useEffect(() => {
    if (mode === "delete") {
      showDetails(productId);
    }
  }, [mode, productId, showDetails]);

  const handleAdd = () => {
    add();
    toaster.create({ id: "add", title: "Saving product in your collection...", type: "loading" });
  };
  
  const resultsToDisplay = mode === "add" ? parseResult?.products : productDetails;
  const isLoading = mode === "delete" && isLoadingDetails;
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog.Root {...props} size="3xl" placement="center" initialFocusEl={() => contentRef.current}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content _dark={{ bg: "#4A3535" }} ref={contentRef} tabIndex={-1}>
            <Dialog.Header>
              <Dialog.Title fontSize="2xl">{mode === "add" ? "Search Result" : "Product Details"}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {isLoading || (!resultsToDisplay && mode === "delete") ? (
                <Box py={20} textAlign="center">
                  <Text color="fg.muted">Loading details...</Text>
                </Box>
              ) : (
                <HStack alignItems="stretch" width="100%" gap={4} overflowX="auto" pb={4} pt={2}>
                  {(
                    Object.entries(resultsToDisplay || {}) as [
                      StoreName,
                      ProductRecord | null,
                    ][]
                  ).map(([storeName, product]) => (
                    <ProductStoreRecordsCard
                      key={storeName}
                      product={product}
                      storeName={formatStoreName(storeName)}
                    />
                  ))}
                </HStack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              {mode === "add" ? (
                <Button color="white" bg="#CEABB0" _hover={{ bg: "#b59297" }} onClick={handleAdd} loading={isAdding}>
                  Add to My Collection
                </Button>
              ) : (
                <Button colorPalette="red" variant="outline" onClick={() => deleteProductDialog.open("a", {productId, setRefreshCount})}>
                  Delete product from Collection
                </Button>
              )}
            </Dialog.Footer>
            <DialogCloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
