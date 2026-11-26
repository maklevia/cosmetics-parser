import {
  Badge,
  Box,
  Button,
  createOverlay,
  Dialog,
  HStack,
  Image,
  Portal,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DialogCloseTrigger } from "@fe/components/ui/dialog";
import { addProductDialog } from "@fe/modules/collection/components/AddProductDialog";
import { useParserByLink } from "@fe/modules/collection/components/ParseForm/hooks/useParserByLink";
import type { NeedsVariantParseResult } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import { formatStoreName } from "@fe/utils/stringUtils";
import { useRef, useState } from "react";

interface Props {
  needsVariant: NeedsVariantParseResult;
  productLink: string;
  refreshProducts: () => void;
}

export const variantPickerDialog = createOverlay((props: Props) => {
  const { needsVariant, productLink, refreshProducts } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const { isLoading: isParsing, parse, errorMessage } = useParserByLink();

  const [selectedOptionId, setSelectedOptionId] = useState(() => {
    const defaultOption =
      needsVariant.options.find((option) => option.isDefault) ??
      needsVariant.options[0];

    return defaultOption?.optionId ?? "";
  });

  const handleConfirm = async () => {
    if (!selectedOptionId) return;

    try {
      const response = await parse(productLink, selectedOptionId);

      if (response?.status === "parsed") {
        variantPickerDialog.close("a");
        addProductDialog.open("a", {
          productId: response.productId,
          parseResult: {
            primaryStore: response.primaryStore,
            products: response.products,
          },
          refreshProducts,
        });
      }
    } catch {
      // Error message is handled via errorMessage state and displayed in the dialog
    }
  };

  return (
    <Dialog.Root {...props} size="lg" placement="center" initialFocusEl={() => contentRef.current}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content _dark={{ bg: "#4A3535" }} ref={contentRef} tabIndex={-1}>
            <Dialog.Header>
              <Dialog.Title fontSize="2xl">Select Variant</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack gap={4} alignItems="stretch">
                <HStack gap={4} alignItems="center">
                  <Box
                    bg="rgb(240, 230, 228)"
                    _dark={{ bg: "rgba(0,0,0,0.15)" }}
                    p={2}
                    borderRadius="xl"
                    w="90px"
                    h="90px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Image
                      src={needsVariant.product.image}
                      alt="Product Image"
                      maxHeight="100%"
                      maxWidth="100%"
                      objectFit="contain"
                    />
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="fg.muted" fontWeight="bold" textTransform="uppercase">
                      {needsVariant.product.brand}
                    </Text>
                    <Text fontSize="lg" fontWeight="semibold" lineClamp={2}>
                      {needsVariant.product.name}
                    </Text>
                    <Badge colorPalette="pink" variant="subtle" mt={1}>
                      {formatStoreName(needsVariant.primaryStore)}
                    </Badge>
                  </Box>
                </HStack>

                <Text color="fg.muted" fontSize="sm">
                  This product has multiple variants. Select one to search for the same variant across stores.
                </Text>

                <Box maxH="300px" overflowY="auto" pr={2}>
                  <SimpleGrid columns={{ base: 2, md: 3 }} gap={2}>
                    {needsVariant.options.map((option) => {
                      const isSelected = option.optionId === selectedOptionId;

                      return (
                        <Button
                          key={option.optionId}
                          size="sm"
                          height="auto"
                          py={2}
                          whiteSpace="normal"
                          textAlign="left"
                          onClick={() => setSelectedOptionId(option.optionId)}
                          bg={isSelected ? "brand.solid" : "transparent"}
                          color={isSelected ? "white" : "brand.text"}
                          border="1px solid"
                          borderColor={isSelected ? "brand.solid" : "gray.200"}
                          _hover={{
                            bg: isSelected ? "brand.hover" : "gray.50",
                          }}
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </SimpleGrid>
                </Box>

                {errorMessage && (
                  <Text color="red.500" fontSize="sm">
                    {errorMessage}
                  </Text>
                )}
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button
                color="white"
                bg="brand.solid"
                _hover={{ bg: "brand.hover" }}
                onClick={handleConfirm}
                loading={isParsing}
                disabled={!selectedOptionId}
              >
                Search Variant
              </Button>
            </Dialog.Footer>
            <DialogCloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});
