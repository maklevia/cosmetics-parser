import { Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useCollection } from "@fe/modules/collection/hooks/useCollection";
import { useParseAndOpenDialog } from "@fe/modules/collection/components/ParseForm/hooks/useParseAndOpenDialog";

export function ParseLinkInput() {
  const { refreshProducts } = useCollection();
  const { productLink, setProductLink, isParsing, errorMessage, handleParse } =
    useParseAndOpenDialog({ refreshProducts });

  return (
    <Box w="100%" bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" _dark={{ bg: "#4A3535", borderColor: "whiteAlpha.100" }}>
      <Stack gap={4}>
        <Text fontSize="lg" fontWeight="semibold">Search Product</Text>
        <Text color="fg.muted">Paste a link to a cosmetic product below to check its price across stores.</Text>
        <Flex gap={4}>
          <Input 
            placeholder="https://makeup.ua/product/..." 
            size="lg"
            value={productLink}
            onChange={(e) => setProductLink(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            bg="gray.50"
            _dark={{ bg: "whiteAlpha.50" }}
            border="none"
            _focus={{ ring: "2px", ringColor: "brand.muted" }}
          />
          <Button size="lg" color="white" bg="brand.solid" _hover={{ bg: "brand.hover" }} loading={isParsing} onClick={handleParse}>
            Search
          </Button>
        </Flex>
        {errorMessage && (
          <Text color="red.500" fontSize="sm">{errorMessage}</Text>
        )}
      </Stack>
    </Box>
  );
}
