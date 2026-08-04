import { deleteProductDialog } from "@fe/modules/collection/components/CollectionArea/components/DeleteProductDialog";
import { ProductCard } from "@fe/modules/collection/components/CollectionArea/components/ProductCard";
import { useCollection } from "@fe/modules/collection/components/CollectionArea/hooks/useCollection";
import { Box, Button, Grid, Heading, HStack, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { productsDialog } from "@fe/modules/collection/components/ProductsDialog";

interface Props {
  refreshCount: number;
  setRefreshCount: React.Dispatch<React.SetStateAction<number>>
}

export function CollectionArea(props: Props) {
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
    <Box w="100%">
      <VStack align="flex-start" gap={6}>
        <HStack justify="space-between" w="100%">
          <Heading size="xl" color="rgb(156, 111, 111)" _dark={{ color: "white" }}>
            My Saved Products
          </Heading>
          {products && products.length > 0 && (
            <Button onClick={handleClick} variant="ghost" colorPalette="pink">
              {seeAll ? "Hide" : "See all"}
            </Button>
          )}
        </HStack>

        {!isLoading && (!products || products.length === 0) && (
          <Box w="100%" py={10} bg="white" _dark={{ bg: "#4A3535", borderColor: "whiteAlpha.200" }} borderRadius="2xl" border="1px dashed" borderColor="gray.300" textAlign="center">
            <Text color="fg.muted">Your collection is empty. Search a product to add it!</Text>
          </Box>
        )}

        {!isLoading && products && products.length > 0 && (
          <Grid gap="4" templateColumns="repeat(4, 1fr)" w="100%">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} 
              onClick={() => productsDialog.open("a", { mode: "delete", productId: product.productId, setRefreshCount })} />
            ))}
          </Grid>
        )}
      </VStack>
    </Box>
  );
}
