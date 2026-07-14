import type { CollectionProduct } from "@/components/collection/screens/CollectionArea/types/CollectionProduct";
import { CardRoot, CardBody, Image, Heading, Text, Stack, Box } from "@chakra-ui/react";

interface CollectionProductProp {
    product: CollectionProduct;
}

export function ProductCard({product}: CollectionProductProp) {
    return (
        <CardRoot 
                maxWidth="300px" 
                height="100%" 
                borderWidth="1px" 
                borderRadius="lg"
                overflow="hidden"
                _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                transition="all 0.2s"
            >
                <CardBody padding="4">
                    <Stack gap="4" align="center">
                        {/* Image Container: Keeps image height consistent without stretching */}
                        <Box height="140px" display="flex" alignItems="center" justifyContent="center">
                            <Image 
                                maxHeight='100%' 
                                maxWidth='100%' 
                                objectFit='contain' 
                                src={product.image} 
                                alt={product.name}
                            />
                        </Box>

                        {/* Text Container */}
                        <Stack gap="1" width="100%" textAlign="center">
                            {/* Brand (subtle, uppercase) */}
                            <Text fontSize='xs' color="gray.500" textTransform="uppercase" fontWeight="bold">
                                {product.brand}
                            </Text>
                            
                            {/* Product Name (truncated if it's too long to keep cards uniform) */}
                            <Heading fontSize='sm' lineClamp={2}>
                                {product.name}
                            </Heading>
                        </Stack>
                    </Stack>
                </CardBody>
            </CardRoot>

    )
}