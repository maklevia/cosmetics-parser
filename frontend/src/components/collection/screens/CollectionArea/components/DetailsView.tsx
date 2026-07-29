import type { ParsedProducts } from "@fe/components/collection/screens/ParsePopupForm/types/parsedProduct";
import { ProductStoreRecordsCard } from "@fe/components/collection/screens/ProductStoreRecordsCard";
import { HStack } from "@chakra-ui/react";

interface Props {
  productDetails: ParsedProducts;
}

export function DetailsView(props: Props) {
  const { productDetails } = props;

  return (
    <HStack>
      <ProductStoreRecordsCard
        product={productDetails.eva}
        storeName="Eva.ua"
      />
      <ProductStoreRecordsCard
        product={productDetails.makeup}
        storeName="Makeup.ua"
      />

      <ProductStoreRecordsCard
        product={productDetails.notino}
        storeName="Notino.ua"
      />
    </HStack>
  );
}
