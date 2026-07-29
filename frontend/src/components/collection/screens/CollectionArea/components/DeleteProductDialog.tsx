import { productDetailsDialog } from "@fe/components/collection/screens/CollectionArea/components/ProductDetailsDialog";
import { useDeleteProducts } from "@fe/components/collection/screens/CollectionArea/hooks/useDeleteProduct";
import { toaster } from "@fe/components/ui/toaster";
import {
  AbsoluteCenter,
  Button,
  createOverlay,
  Dialog,
  HStack,
  Portal,
} from "@chakra-ui/react";

interface Props {
  productId: number;
  setRefreshCount?: React.Dispatch<React.SetStateAction<number>>;
}

export const deleteProductDialog = createOverlay((props: Props) => {
  const { productId, setRefreshCount } = props;

  const { isLoading, deleteProduct } = useDeleteProducts({ productId });

  const handleDelete = async () => {
    try {
      await deleteProduct();
      toaster.success({title: 'Product deleted successfully'});
      setRefreshCount?.((prev: number) => prev + 1);

      deleteProductDialog.close("a");
      productDetailsDialog.close("a");
    } catch {
      toaster.error({ title: 'Something went wrong. Please try again later.' });
    }
  };

  return (
    <AbsoluteCenter>
      <Dialog.Root {...props}>
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header />

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
            </Dialog.Content>
          </Dialog.Positioner>
          <Dialog.CloseTrigger />
        </Portal>
      </Dialog.Root>
    </AbsoluteCenter>
  );
});
