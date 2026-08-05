import { createOverlay, Dialog, Portal, Button, HStack } from "@chakra-ui/react";
import { ProductStoreRecordsCard } from "@fe/modules/collection/components/ProductStoreRecordsCard";
import type { ParseResult, ProductRecord } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import type { StoreName } from "@fe/types/store.typedefs";
import { formatStoreName } from "@fe/utils/stringUtils";
import { useAddProductToCollection } from "@fe/modules/collection/components/ParseForm/hooks/useAddProductToCollection";
import { toaster } from "@fe/components/ui/toaster";
import { DialogCloseTrigger } from "@fe/components/ui/dialog";
import { useRef } from "react";

interface Props {
  productId: number;
  parseResult: ParseResult;
  refreshProducts: () => void;
}

export const addProductDialog = createOverlay((props: Props) => {
  const { productId, parseResult, refreshProducts } = props;
  const contentRef = useRef<HTMLDivElement>(null);

  const { add, isLoading: isAdding } = useAddProductToCollection({
    productId,
    onSuccess: () => {
      refreshProducts();
      toaster.update("add", { title: "Product successfully saved in your Collection", type: "success" });
      addProductDialog.close("a");
    },
    onFailure: (message) => {
      setTimeout(() => toaster.update("add", { title: message, type: "error" }));
    }
  });

  const handleAdd = () => {
    add();
    toaster.create({ id: "add", title: "Saving product in your collection...", type: "loading" });
  };

  return (
    <Dialog.Root {...props} size="3xl" placement="center" initialFocusEl={() => contentRef.current}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content _dark={{ bg: "#4A3535" }} ref={contentRef} tabIndex={-1}>
            <Dialog.Header>
              <Dialog.Title fontSize="2xl">Search Result</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <HStack alignItems="stretch" width="100%" gap={4} overflowX="auto" pb={4} pt={2}>
                {(
                  Object.entries(parseResult.products) as [
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
            </Dialog.Body>

            <Dialog.Footer>
              <Button color="white" bg="brand.solid" _hover={{ bg: "brand.hover" }} onClick={handleAdd} loading={isAdding}>
                Add to My Collection
              </Button>
            </Dialog.Footer>
            <DialogCloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
