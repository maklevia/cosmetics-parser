import { Card, Input, Button, Stack, Flex } from "@chakra-ui/react";
import { useAuth } from "@fe/modules/auth/hooks/useAuth";
import { useUpdateProfile } from "@fe/modules/profile/components/UserDetailsCard/hooks/useUpdateProfile";
import { useLogout } from "@fe/modules/auth/hooks/useLogout";
import { ResetPasswordDialog } from "./components/ResetPasswordDialog";
import { useState } from "react";
import { Field } from "@fe/components/ui/field";

export function UserDetailsCard() {
  const { user } = useAuth();
  const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [editedName, setEditedName] = useState<string | null>(null);
  const currentName = editedName !== null ? editedName : (user?.name || "");

  const handleUpdateName = async () => {
    await updateProfile({ newName: currentName });
    setEditedName(null);
  };

  return (
    <Card.Root size="lg" variant="outline" w="100%" borderRadius="2xl" boxShadow="sm" bg="white" _dark={{ bg: "surface.page", borderColor: "whiteAlpha.100" }}>
      <Card.Header pb={2}>
        <Card.Title fontSize="xl">Account Details</Card.Title>
      </Card.Header>
      <Card.Body pt={2}>
        <Stack gap={6}>
          <Field label="Email Address">
            <Input value={user?.email || ""} readOnly disabled variant="subtle" />
          </Field>
          
          <Field label="Display Name">
            <Flex gap={3} w="100%">
              <Input 
                value={currentName} 
                onChange={(e) => setEditedName(e.target.value)} 
                placeholder="Enter your name" 
              />
              <Button 
                onClick={handleUpdateName} 
                loading={isUpdating} 
                disabled={currentName === user?.name || !currentName.trim()}
                bg="brand.solid"
                color="white"
                _hover={{ bg: "brand.hover" }}
              >
                Save
              </Button>
            </Flex>
          </Field>
        </Stack>
      </Card.Body>
      <Card.Footer borderTop="1px solid" borderColor="gray.100" _dark={{ borderColor: "whiteAlpha.100" }} pt={4} mt={2}>
        <Flex justify="space-between" w="100%">
          <ResetPasswordDialog />
          <Button variant="ghost" colorPalette="red" onClick={logout} loading={isLoggingOut}>
            Log Out
          </Button>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
}
