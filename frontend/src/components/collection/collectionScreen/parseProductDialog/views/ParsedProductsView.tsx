import { ParsedProductCard } from "@/components/collection/collectionScreen/parseProductDialog/views/ParsedProductCard";
import type { ParsedProducts } from "@/components/collection/collectionScreen/parseProductDialog/types/parsedProduct";
import { Dialog, HStack } from "@chakra-ui/react";

export function ParsedProductsView({
  parsedProducts,
}: {
  parsedProducts: ParsedProducts;
}) {
  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Search Result</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body gap='2'>
        <HStack alignItems="stretch" width="100%">
          <ParsedProductCard
            product={parsedProducts.eva}
            storeName="Eva.ua"
          ></ParsedProductCard>
          <ParsedProductCard
            product={parsedProducts.makeup}
            storeName="Makeup.ua"
          ></ParsedProductCard>
          <ParsedProductCard
            product={parsedProducts.notino}
            storeName="Notino.ua"
          ></ParsedProductCard>
        </HStack>
      </Dialog.Body>
    </>
  );
}
