import { Stack, Container, Heading } from "@chakra-ui/react";
import { UserDetailsCard } from "./components/UserDetailsCard/UserDetailsCard";
import { ChannelConnectionsCard } from "./components/ChannelConnectionsCard/ChannelConnectionsCard";

export function ProfileScreen() {
  return (
    <Container maxW="3xl" pt={4} pb={10}>
      <Stack gap={8}>
        <Heading size="3xl" color="rgb(156, 111, 111)" _dark={{ color: "white" }} mb={2}>
          Profile Settings
        </Heading>
        
        <UserDetailsCard />
        
        <ChannelConnectionsCard />
      </Stack>
    </Container>
  );
}
