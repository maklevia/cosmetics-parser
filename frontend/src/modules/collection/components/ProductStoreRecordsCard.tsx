import type { ProductRecord } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import { Card, HStack, Image, Text, Box, Badge, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface ProductRecordProp {
  product: ProductRecord | null;
  storeName: string;
}

export function ProductStoreRecordsCard({
  product,
  storeName,
}: ProductRecordProp) {

  return (
    <Card.Root flex="1" minWidth="240px" minHeight="450px" borderRadius="2xl" variant="outline" overflow="hidden" boxShadow="sm" _dark={{ bg: "#2F2121", borderColor: "whiteAlpha.100" }}>
      <Box bg="rgb(240, 230, 228)" py={3} px={4} borderBottom="1px solid" borderColor="blackAlpha.100" _dark={{ bg: "#3D2A2A", borderColor: "whiteAlpha.100" }}>
        <Text fontWeight="bold" fontSize="lg" color="brand.text" _dark={{ color: "white" }}>
          {storeName}
        </Text>
      </Box>

      {product ? (
        <Card.Body gap="4" px={4} py={5} display="flex" flexDirection="column">
          <Box bg="white" _dark={{ bg: "rgba(0,0,0,0.15)" }} p={2} borderRadius="xl" alignSelf="center" w="100%" h="180px" display="flex" alignItems="center" justifyContent="center">
            <Image
              src={product.image}
              alt="Product Image"
              maxHeight="100%"
              maxWidth="100%"
              objectFit="contain"
            />
          </Box>

          <Box>
            <Text fontSize="xs" color="fg.muted" fontWeight="bold" textTransform="uppercase">{product.brand}</Text>
            <Card.Title fontSize="sm" lineClamp={2} mt={1}>{product.name}</Card.Title>
          </Box>

          <HStack justify="space-between" mt="auto">
            <Text fontSize="lg" fontWeight="bold">₴{product.price}</Text>
            <Badge colorPalette={product.inStock ? "green" : "red"} variant="subtle">
              {product?.inStock ? "In stock" : "Out of stock"}
            </Badge>
          </HStack>

          {product.lowestMonthPrice && (
            <Text fontSize="xs" color="fg.muted">
              Lowest price for the last month: ₴{product.lowestMonthPrice}
            </Text>
          )}

          <Button asChild variant="outline" size="sm" mt={2} w="100%" color="brand.text" borderColor="brand.text" _dark={{ color: "#E9D8DB", borderColor: "rgba(233, 216, 219, 0.4)", _hover: { bg: "rgba(233, 216, 219, 0.1)" } }}>
            <Link to={product.link} target="_blank">
              View in store
            </Link>
          </Button>
            
        </Card.Body>
      ) : (
        <Card.Body justifyContent="center" alignItems="center">
          <Text color="fg.muted" textAlign="center" fontSize="sm">Product not found on {storeName}</Text>
        </Card.Body>
      )}
    </Card.Root>
  );
}
