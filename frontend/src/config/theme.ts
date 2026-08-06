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
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: { base: "#CEABB0", _dark: "#CEABB0" } },
          hover: { value: { base: "#b59297", _dark: "#b59297" } },
          text: { value: { base: "rgb(156, 111, 111)", _dark: "#E8C4C4" } },
          muted: { value: { base: "rgba(210, 170, 162, 1)", _dark: "rgba(210, 170, 162, 1)" } },
        },
        surface: {
          page: {
            value: {
              base: "radial-gradient(circle, rgba(233, 216, 219, 1) 77%, rgba(199, 169, 174, 1) 100%)",
              _dark: "radial-gradient(circle, rgba(66, 44, 44, 1) 16%, rgba(38, 26, 22, 1) 100%)",
            },
          },
          card: { value: { base: "white", _dark: "#2F2121" } },
          cardElevated: { value: { base: "white", _dark: "#4A3535" } },
          header: { value: { base: "#CEABB0", _dark: "#1F1515" } },
          authCard: { value: { base: "#faf8f7", _dark: "#2A1D1D" } },
        },
      },
    },
  },
});
