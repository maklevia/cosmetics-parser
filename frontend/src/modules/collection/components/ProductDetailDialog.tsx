import { createOverlay, Dialog, Portal, Button, HStack, Box, Text } from "@chakra-ui/react";
import { ProductStoreRecordsCard } from "./ProductStoreRecordsCard";
import type { ProductRecord } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import type { StoreName } from "@fe/types/store.typedefs";
import { formatStoreName } from "@fe/utils/stringUtils";
import { useProductDetails } from "@fe/modules/collection/components/CollectionArea/hooks/useProductDetails";
import { deleteProductDialog } from "@fe/modules/collection/components/CollectionArea/components/DeleteProductDialog";
import { DialogCloseTrigger } from "@fe/components/ui/dialog";
import { useEffect, useRef } from "react";

interface Props {
  productId: number;
  refreshProducts?: () => void;
}

export const productDetailDialog = createOverlay((props: Props) => {
  const { productId, refreshProducts } = props;
  const { isLoading, productDetails, showDetails } = useProductDetails();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    showDetails(productId);
  }, [productId, showDetails]);

  return (
    <Dialog.Root {...props} size="xl" placement="center" initialFocusEl={() => contentRef.current}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content _dark={{ bg: "#4A3535" }} ref={contentRef} tabIndex={-1}>
            <Dialog.Header>
              <Dialog.Title fontSize="2xl">Product Details</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {isLoading || !productDetails ? (
                <Box py={20} textAlign="center">
                  <Text color="fg.muted">Loading details...</Text>
                </Box>
              ) : (
                <HStack alignItems="stretch" width="100%" gap={4} overflowX="auto" pb={4} pt={2}>
                  {(
                    Object.entries(productDetails) as [
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
              <Button colorPalette="red" variant="outline" onClick={() => deleteProductDialog.open("a", {productId, refreshProducts})}>
                Delete product from Collection
              </Button>
            </Dialog.Footer>
            <DialogCloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
