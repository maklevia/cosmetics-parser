import { ProductStoreRecordsCard } from "@/components/collection/screens/ProductStoreRecordsCard";
import type { ParseResult } from "@/components/collection/screens/ParsePopupForm/types/parsedProduct";
import { Button, Dialog, HStack } from "@chakra-ui/react";
import { useAddProductToCollection } from "@/components/collection/screens/ParsePopupForm/hooks/useAddProductToCollection";
import { toaster } from "@/components/ui/toaster";

interface Props {
  parseResult: ParseResult;
  productId: number;
  setRefreshCount: React.Dispatch<React.SetStateAction<number>>
}

export function ParsedProductsView({
  parseResult,
  productId,
  setRefreshCount,
}: Props) {
  const onSuccess = () => {
    setRefreshCount((prevCount) => prevCount+1)
    toaster.update("add", {
      title: "Product successfully saved in your Collection",
      type: "success",
    });
  };

  const onFailure = (message: string) => {
    setTimeout(() => {
      toaster.update("add", {
        title: message,
        type: "error",
      });
    });
  };

  const { add, isLoading } = useAddProductToCollection({
    productId,
    onSuccess,
    onFailure,
  });

  const handleClick = () => {
    add();
    toaster.create({
      id: "add",
      title: "Saving product in your collection...",
      type: "loading",
    });
  };

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Search Result</Dialog.Title>
      </Dialog.Header>

      <Dialog.Body gap="2">
        <HStack alignItems="stretch" width="100%">
          
          {Object.values(parseResult.products)
          .filter((product) => product !== null)
          .map((product, index) => (
            <ProductStoreRecordsCard
            key={index}
            product={product}
            storeName="Something"
            />
          ))
         }

        </HStack>
      </Dialog.Body>

      <Dialog.Footer>
        <Button onClick={handleClick} disabled={isLoading}>
          Add to My Collection
        </Button>
      </Dialog.Footer>
    </>
  );
}
