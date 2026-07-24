import { deleteProductDialog } from "@/components/collection/screens/CollectionArea/components/DeleteProductDialog";
import { ProductCard } from "@/components/collection/screens/CollectionArea/components/ProductCard";
import { productDetailsDialog } from "@/components/collection/screens/CollectionArea/components/ProductDetailsDialog";
import { useCollection } from "@/components/collection/screens/CollectionArea/hooks/useCollection";
import { Box, Button, Grid, Heading, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface Props {
  refreshCount: number;
  setRefreshCount: React.Dispatch<React.SetStateAction<number>>
}

export function CollectionArea(props: Props) {
  //true - activated
  const [seeAll, setSeeAll] = useState(false);
  const { refreshCount, setRefreshCount } = props;
  const { isLoading, products, getRestProducts, hideRestProducts } =
    useCollection({ refreshCount, setSeeAll });

  const handleClick = () => {
    setSeeAll((seeAll) => !seeAll);
    if (seeAll) {
      hideRestProducts();
    } else {
      getRestProducts();
    }
  };

  return (
    <Box>
      <VStack>
        <HStack>
          <Heading>My Collection</Heading>
          <Button onClick={handleClick}>{seeAll ? "Hide" : "See all"}</Button>
        </HStack>

        {isLoading ? (
          <></>
        ) : (
          <Grid gap="3" templateColumns="repeat(4, 1fr)">
            {products?.map((product) => (
              <ProductCard key={product.productId} product={product} 
              onClick={() => productDetailsDialog.open("a", {productId: product.productId, setRefreshCount})} />
            ))}
          </Grid>
        )}

        <productDetailsDialog.Viewport />
        <deleteProductDialog.Viewport />
        
      </VStack>
    </Box>
  );
}
