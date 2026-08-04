import { Box } from "@chakra-ui/react";
import { Header } from "@fe/components/layouts/Header/Header";
import { useColorModeValue } from "@fe/components/ui/color-mode";
import { Outlet } from "react-router-dom";
import { productsDialog } from "@fe/modules/collection/components/ProductsDialog";
import { deleteProductDialog } from "@fe/modules/collection/components/CollectionArea/components/DeleteProductDialog";

export function MainLayout() {
  const pageBg = useColorModeValue(
    "radial-gradient(circle, rgba(233, 216, 219, 1) 77%, rgba(199, 169, 174, 1) 100%)", 
    "radial-gradient(circle,rgba(66, 44, 44, 1) 16%, rgba(38, 26, 22, 1) 100%)"
  );

  return (
    <Box bg={pageBg} minH="100vh" w="100%">
      <Header />
      <Box p={6}>
        <Outlet />
      </Box>
      <productsDialog.Viewport />
      <deleteProductDialog.Viewport />
    </Box>
  );
}
