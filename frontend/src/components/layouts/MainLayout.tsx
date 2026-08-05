import { Box } from "@chakra-ui/react";
import { Header } from "@fe/components/layouts/Header/Header";
import { Outlet } from "react-router-dom";
import { productsDialog } from "@fe/modules/collection/components/ProductsDialog";
import { deleteProductDialog } from "@fe/modules/collection/components/CollectionArea/components/DeleteProductDialog";

export function MainLayout() {
  return (
    <Box bg="surface.page" minH="100vh" w="100%">
      <Header />
      <Box p={6}>
        <Outlet />
      </Box>
      <productsDialog.Viewport />
      <deleteProductDialog.Viewport />
    </Box>
  );
}
