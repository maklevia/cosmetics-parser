import type { CollectionProduct } from "@fe/modules/collection/components/CollectionArea/types/CollectionProduct";
import { Card, Image, Heading, Text, Stack, Box } from "@chakra-ui/react";

interface CollectionProductProp {
    product: CollectionProduct;
    onClick: () => void
}

export function ProductCard({product, onClick}: CollectionProductProp) {
    return (
        <Card.Root 
                onClick={onClick}
                w="100%" 
                h="100%"
                bg="white"
                borderWidth="1px" 
                borderColor="gray.100"
                _dark={{ bg: "#2F2121", borderColor: "whiteAlpha.100" }}
                borderRadius="2xl"
                overflow="hidden"
                cursor="pointer"
                _hover={{ shadow: "md", transform: "translateY(-4px)", borderColor: "rgb(216, 180, 173)" }}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            >
                <Card.Body padding="5">
                    <Stack gap="4" align="center" h="100%">
                        <Box height="140px" display="flex" alignItems="center" justifyContent="center">
                            <Image 
                                maxHeight='100%' 
                                maxWidth='100%' 
                                objectFit='contain' 
                                src={product.image} 
                                alt={product.name}
                            />
                        </Box>

                        <Stack gap="1" width="100%" textAlign="center" mt="auto">
                            <Text fontSize='xs' color="fg.muted" textTransform="uppercase" fontWeight="bold">
                                {product.brand}
                            </Text>
                            
                            <Heading fontSize='sm' lineClamp={2} fontWeight="medium">
                                {product.name}
                            </Heading>
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card.Root>

    )
}