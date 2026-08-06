import { Card, Text, Flex, Box } from "@chakra-ui/react";
import { useAuth } from "@fe/modules/auth/hooks/useAuth";
import { ChannelLinks } from "@fe/modules/profile/components/ChannelConnectionsCard/components/ChannelLinks";
import { FaTelegram } from "react-icons/fa";

export function ChannelConnectionsCard() {
  const { user } = useAuth();
  const isConnected = !!user?.telegramAccountId;

  return (
    <Card.Root size="lg" variant="outline" w="100%" borderRadius="2xl" boxShadow="sm" bg="white" _dark={{ bg: "#2A1D1D", borderColor: "whiteAlpha.100" }}>
      <Card.Header pb={2}>
        <Card.Title fontSize="xl">Connected Accounts</Card.Title>
      </Card.Header>
      <Card.Body pt={2}>
        <Flex 
          p={5} 
          border="1px solid" 
          borderColor={isConnected ? "blue.200" : "gray.200"} 
          _dark={{ borderColor: isConnected ? "blue.800" : "whiteAlpha.200", bg: isConnected ? "blue.950" : "transparent" } } 
          borderRadius="xl"
          align="center"
          justify="space-between"
          bg={isConnected ? "blue.50" : "transparent"}
          transition="all 0.2s"
        >
          <Flex align="center" gap={4}>
            <Box 
              color="#0088cc" 
              bg={isConnected ? "white" : "gray.50"} 
              _dark={{ bg: isConnected ? "whiteAlpha.200" : "whiteAlpha.100" }}
              p={3} 
              borderRadius="full" 
              boxShadow="sm"
            >
              <FaTelegram size={28} />
            </Box>
            <Box>
              <Text fontWeight="semibold" fontSize="md">Telegram</Text>
              <Text fontSize="sm" color="fg.muted">
                {isConnected 
                  ? "You will receive price drop alerts via our Telegram bot." 
                  : "Connect to get instant price drop notifications."}
              </Text>
            </Box>
          </Flex>

          <Box>
            {isConnected ? (
              <Flex align="center" gap={2} bg="white" _dark={{ bg: "whiteAlpha.200", borderColor: "blue.800"}} border="1px solid" borderColor="blue.100" px={4} py={1.5} borderRadius="full" boxShadow="sm">
                <Text fontSize="sm" color="blue.600" _dark={{ color: "blue.300" }} fontWeight="bold">
                  ✓ Connected
                </Text>
              </Flex>
            ) : (
              <ChannelLinks />
            )}
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
