import type { ProductRecord } from "@/components/collection/collectionScreen/parseProductDialog/types/parsedProduct";
import { Card, HStack, Image, Text } from "@chakra-ui/react";

interface ProductRecordProp {
    product: ProductRecord | null,
    storeName: string
}


export function ParsedProductCard({ product, storeName }: ProductRecordProp,) {
    const inStockText = () => {
        const text: string = product?.inStock ? 'In stock' : 'Out of stock';
        return text;
    }

  return (
    <Card.Root flex="1" height="450px">
        <Card.Header>
            <Card.Title>{storeName} Result</Card.Title>
        </Card.Header>
        {product ? (
            <Card.Body gap='2'>
            <Image 
            src={product.image}
            alt='Product Image' 
            height='200px'
            width='100%'
            objectFit='contain'
            />
            <Card.Title>{product.name}</Card.Title>
            <Card.Description>{product.brand}</Card.Description>
            <HStack>
                <Text>{product.price}₴</Text>
                <Text>{inStockText()}</Text>
            </HStack>
        </Card.Body>
        ) : (
            <Card.Body>
                <Card.Description>Product not found on {storeName}</Card.Description>
            </Card.Body>
        )}
    </Card.Root>
  );
}
