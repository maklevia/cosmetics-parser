import { Card, Input, Button, Stack, Flex } from "@chakra-ui/react";
import { useAuth } from "@fe/modules/auth/hooks/useAuth";
import { useUpdateProfile } from "@fe/modules/profile/components/UserDetailsCard/hooks/useUpdateProfile";
import { useLogout } from "@fe/modules/auth/hooks/useLogout";
import { ResetPasswordDialog } from "./components/ResetPasswordDialog";
import { useState } from "react";
import { Field } from "@fe/components/ui/field";

export function UserDetailsCard() {
  const { user, reloadUser } = useAuth();
  const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
  const { logout, isLoading: isLoggingOut } = useLogout();
  
  const [name, setName] = useState(user?.name || "");
  const [prevName, setPrevName] = useState(user?.name || "");

  if (user?.name && user.name !== prevName) {
    setName(user.name);
    setPrevName(user.name);
  }

  const handleUpdateName = async () => {
    await updateProfile({ newName: name });
  };

  return (
    <Card.Root size="lg" variant="outline" w="100%" borderRadius="2xl" boxShadow="sm" bg="white" _dark={{ bg: "#2A1D1D", borderColor: "whiteAlpha.100" }}>
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
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name" 
              />
              <Button 
                onClick={handleUpdateName} 
                loading={isUpdating} 
                disabled={name === user?.name || !name.trim()}
                bg="#CEABB0"
                color="white"
                _hover={{ bg: "#b59297" }}
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
