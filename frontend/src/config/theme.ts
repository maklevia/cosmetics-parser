import { createSystem, defaultConfig, defineRecipe } from "@chakra-ui/react";

const customInputRecipe = defineRecipe({
  variants: {
    variant: {
      auth: {
        border: "1px solid",
        borderRadius: "lg",
        py: 5,
        bg: "gray.50",
        borderColor: "gray.200",
        color: "gray.800",
        _placeholder: { color: "gray.400" },
        _hover: { borderColor: "gray.300" },
        _focus: {
          borderColor: "rgba(196, 159, 152, 0.8)",
          boxShadow: "0 0 0 1px rgba(196, 159, 152, 0.3)",
        },
        _invalid: {
          borderColor: "red.500 !important",
          boxShadow: "0 0 0 1px var(--chakra-colors-red-500) !important",
        },
        _dark: {
          bg: "gray.700",
          borderColor: "gray.600",
          color: "gray.100",
          _placeholder: { color: "gray.500" },
          _hover: { borderColor: "gray.500" },
          _focus: {
            borderColor: "rgba(196, 159, 152, 0.6)",
            boxShadow: "0 0 0 1px rgba(196, 159, 152, 0.2)",
          },
          _invalid: {
            borderColor: "red.500 !important",
            boxShadow: "0 0 0 1px var(--chakra-colors-red-500) !important",
          },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, {
  theme: {
    recipes: {
      input: customInputRecipe,
    },
  },
});
