import { productDetailDialog } from "@fe/modules/collection/components/ProductDetailDialog"
import { useDeleteProducts } from "@fe/modules/collection/components/CollectionArea/hooks/useDeleteProduct";
import { toaster } from "@fe/components/ui/toaster";
import { DialogCloseTrigger } from "@fe/components/ui/dialog";
import {
  Button,
  createOverlay,
  Dialog,
  HStack,
  Portal,
} from "@chakra-ui/react";

interface Props {
  productId: number;
  refreshProducts?: () => void;
}

export const deleteProductDialog = createOverlay((props: Props) => {
  const { productId, refreshProducts } = props;

  const { isLoading, deleteProduct } = useDeleteProducts({ productId });

  const handleDelete = async () => {
    try {
      await deleteProduct();
      toaster.success({title: 'Product deleted successfully'});
      refreshProducts?.();

      deleteProductDialog.close("a");
      productDetailDialog.close("a");

    } catch {
      toaster.error({ title: 'Something went wrong. Please try again later.' });
    }
  };

  return (
      <Dialog.Root {...props} placement="center">
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  Do you want to delete this product from your collection?
                </Dialog.Title>
              </Dialog.Header>

              <Dialog.Footer>
                <HStack gap="3" width="100%" justifyContent="flex-end">
                  <Button disabled={isLoading} onClick={() => handleDelete()}>
                    Delete
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => deleteProductDialog.close("a")}
                  >
                    Cancel
                  </Button>
                </HStack>
              </Dialog.Footer>
              <DialogCloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
  );
});
