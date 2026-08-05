import { Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useParserByLink } from "@fe/modules/collection/components/ParseForm/hooks/useParserByLink";
import { useCheckLink } from "@fe/modules/collection/hooks/useCheckLink";
import { productsDialog } from "@fe/modules/collection/components/ProductsDialog";

interface Props {
  setRefreshCount: React.Dispatch<React.SetStateAction<number>>;
}

export function ParseLinkInput({ setRefreshCount }: Props) {
  const [productLink, setProductLink] = useState("");
  const { isLoading: isParsing, parse, errorMessage, setErrorMessage } = useParserByLink();
  const { checkLink } = useCheckLink();

  const handleParse = async () => {
    if (!productLink.trim()) return;

    if (!checkLink(productLink)) {
      setErrorMessage("Invalid link format");
      return;
    }
    
    try {
      const response = await parse(productLink);
      if (response) {
         productsDialog.open("a", { 
           mode: "add", 
           productId: response.productId, 
           parseResult: response.parsedResults,
           setRefreshCount 
         });
      }
    } catch {
      // Error message is handled via errorMessage state and displayed in the UI
    }
  };

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
