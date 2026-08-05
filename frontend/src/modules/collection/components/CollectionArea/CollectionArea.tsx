import { ProductCard } from "@fe/modules/collection/components/CollectionArea/components/ProductCard";
import { ProductCardSkeleton } from "@fe/modules/collection/components/CollectionArea/components/ProductCardSkeleton";
import { useCollection } from "@fe/modules/collection/hooks/useCollection";
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react";
import { productDetailDialog } from "@fe/modules/collection/components/ProductDetailDialog";

export function CollectionArea() {
  const { isInitialLoading, isLoadingMore, products, hasMore, loadMore, refreshProducts } = useCollection();

  return (
    <Box w="100%">
      <VStack align="flex-start" gap={6}>
        <HStack justify="space-between" w="100%">
          <Heading size="xl" color="brand.text" _dark={{ color: "white" }}>
            My Saved Products
          </Heading>
        </HStack>

        {isInitialLoading && (
          <Grid gap="4" templateColumns="repeat(4, 1fr)" w="100%">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </Grid>
        )}

        {!isInitialLoading && (!products || products.length === 0) && (
          <Box
            w="100%"
            py={10}
            bg="white"
            _dark={{ bg: "#4A3535", borderColor: "whiteAlpha.200" }}
            borderRadius="2xl"
            border="1px dashed"
            borderColor="gray.300"
            textAlign="center"
          >
            <Text color="fg.muted">
              Your collection is empty. Search a product to add it!
            </Text>
          </Box>
        )}

        {!isInitialLoading && products && products.length > 0 && (
          <Grid gap="4" templateColumns="repeat(4, 1fr)" w="100%">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                onClick={() =>
                  productDetailDialog.open("a", {
                    productId: product.productId,
                    refreshProducts,
                  })
                }
              />
            ))}
          </Grid>
        )}

        {hasMore && (
          <Button
            onClick={loadMore}
            loading={isLoadingMore}
            variant="ghost"
            colorPalette="pink"
            alignSelf="center"
          >
            Load more
          </Button>
        )}
      </VStack>
    </Box>
  );
}
