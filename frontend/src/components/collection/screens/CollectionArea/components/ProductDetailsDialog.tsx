import { deleteProductDialog } from "@/components/collection/screens/CollectionArea/components/DeleteProductDialog";
import { DetailsView } from "@/components/collection/screens/CollectionArea/components/DetailsView";
import { useProductDetails } from "@/components/collection/screens/CollectionArea/hooks/useProductDetails";
import {
  AbsoluteCenter,
  Button,
  createOverlay,
  Dialog,
  Portal,
  Spinner,
} from "@chakra-ui/react";
import { useEffect } from "react";

interface Props {
  productId: number;
  setRefreshCount?: React.Dispatch<React.SetStateAction<number>>
}

export const productDetailsDialog = createOverlay((props: Props) => {
  const productId = props.productId;
  const setRefreshCount = props.setRefreshCount
  const { isLoading, productDetails, showDetails } = useProductDetails();

  useEffect(() => {
    showDetails(productId);
  }, [productId]);

  return (
    <AbsoluteCenter>
      <Dialog.Root {...props} size="4xl">
        <Portal>
          <Dialog.Backdrop />

          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Product Details</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                {(isLoading || !productDetails) && <Spinner />}
                {productDetails && !isLoading && (
                  <DetailsView productDetails={productDetails} />
                )}
              </Dialog.Body>

              <Dialog.Footer>
                <Button onClick={() => deleteProductDialog.open("a", {productId, setRefreshCount})}>
                  Delete product from Collection
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
          <Dialog.CloseTrigger />
        </Portal>
      </Dialog.Root>
    </AbsoluteCenter>
  );
});
