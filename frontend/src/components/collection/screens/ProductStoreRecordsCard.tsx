import type { ProductRecord } from "@fe/components/collection/screens/ParsePopupForm/types/parsedProduct";
import { Card, Em, HStack, Image, Text } from "@chakra-ui/react";
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
    <Card.Root flex="1" minHeight="450px">

      <Card.Header>
        <Card.Title>{storeName} Result</Card.Title>
      </Card.Header>

      {product ? (
        <Card.Body gap="2">
          <Image
            src={product.image}
            alt="Product Image"
            height="180px"
            width="100%"
            objectFit="contain"
          />

          <Card.Title fontSize="md" lineClamp={3}>{product.name}</Card.Title>

          <Card.Description>{product.brand}</Card.Description>

          <Card.Description>
            <Link to={product.link} target="_blank">
              <Em>Link to the store</Em>
            </Link>
          </Card.Description>

          <HStack>
            <Text>{product.price}₴</Text>
            <Text>{product?.inStock ? "In stock" : "Out of stock"}</Text>
          </HStack>

            {product.lowest30DayPrice && (
              <Card.Description>
                The lowest price for the 30 days: ₴{product.lowest30DayPrice}
              </Card.Description>
            )}
            
        </Card.Body>
      ) : (
        <Card.Body>
          <Card.Description>Product was not found on {storeName}</Card.Description>
        </Card.Body>
      )}
    </Card.Root>
  );
}
