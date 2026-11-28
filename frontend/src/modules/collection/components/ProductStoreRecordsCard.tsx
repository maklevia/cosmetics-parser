import type { ProductRecord } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface ProductStoreRecordsCardProps {
  products: ProductRecord[];
  storeName: string;
}

export function ProductStoreRecordsCard({
  products,
  storeName,
}: ProductStoreRecordsCardProps) {
  const firstProduct = products[0];

  return (
    <Card.Root
      flex="1"
      minWidth="280px"
      minHeight="450px"
      borderRadius="2xl"
      variant="outline"
      overflow="hidden"
      boxShadow="sm"
      _dark={{ bg: "#2F2121", borderColor: "whiteAlpha.100" }}
    >
      <Box
        bg="rgb(240, 230, 228)"
        py={3}
        px={4}
        borderBottom="1px solid"
        borderColor="blackAlpha.100"
        _dark={{ bg: "#3D2A2A", borderColor: "whiteAlpha.100" }}
      >
        <Text fontWeight="bold" fontSize="lg" color="brand.text" _dark={{ color: "white" }}>
          {storeName}
        </Text>
      </Box>

      {products.length === 0 || !firstProduct ? (
        <Card.Body justifyContent="center" alignItems="center">
          <Text color="fg.muted" textAlign="center" fontSize="sm">
            Product not found on {storeName}
          </Text>
        </Card.Body>
      ) : (
        <Card.Body gap="4" px={4} py={5} display="flex" flexDirection="column">
          <Box
            bg="white"
            _dark={{ bg: "rgba(0,0,0,0.15)" }}
            p={2}
            borderRadius="xl"
            alignSelf="center"
            w="100%"
            h="180px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={firstProduct.image}
              alt="Product Image"
              maxHeight="100%"
              maxWidth="100%"
              objectFit="contain"
            />
          </Box>

          <Box>
            <Text fontSize="xs" color="fg.muted" fontWeight="bold" textTransform="uppercase">
              {firstProduct.brand}
            </Text>
            <Card.Title fontSize="sm" lineClamp={2} mt={1}>
              {firstProduct.name}
            </Card.Title>
          </Box>

          <Stack gap={3} mt="auto">
            {products.map((product, index) => (
              <Box
                key={product.variantId ?? `${product.link}-${index}`}
                bg="gray.50"
                _dark={{ bg: "rgba(0,0,0,0.15)" }}
                p={3}
                borderRadius="xl"
              >
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    ₴{product.price}
                  </Text>
                  <HStack gap={2}>
                    {product.options?.warehouse && (
                      <Badge colorPalette="pink" variant="subtle">
                        {product.options.warehouse.toUpperCase()}
                      </Badge>
                    )}
                    <Badge colorPalette={product.inStock ? "green" : "red"} variant="subtle">
                      {product.inStock ? "In stock" : "Out of stock"}
                    </Badge>
                  </HStack>
                </HStack>

                {product.lowestMonthPrice && (
                  <Text fontSize="xs" color="fg.muted" mt={1}>
                    Lowest price for the last month: ₴{product.lowestMonthPrice}
                  </Text>
                )}

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  mt={2}
                  w="100%"
                  color="brand.text"
                  borderColor="brand.text"
                  _dark={{
                    color: "#E9D8DB",
                    borderColor: "rgba(233, 216, 219, 0.4)",
                    _hover: { bg: "rgba(233, 216, 219, 0.1)" },
                  }}
                >
                  <Link to={product.link} target="_blank">
                    View in store
                  </Link>
                </Button>
              </Box>
            ))}
          </Stack>
        </Card.Body>
      )}
    </Card.Root>
  );
}
