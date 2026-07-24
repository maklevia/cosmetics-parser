import { ChannelLinks } from "@fe/components/profile/components/TelegramLink/ChannelLinks";
import { useProfile } from "@fe/components/profile/hooks/useProfile";
import { AbsoluteCenter, Stack, Text } from "@chakra-ui/react";

export function ProfileScreen() {
  const { userInfo } = useProfile();

  return (
    <AbsoluteCenter>
      <Stack>
        {userInfo?.isTelegramConnected ? (
          <Text>You've connected your telegram ✅</Text>
        ) : (
          <ChannelLinks />
        )}
      </Stack>
    </AbsoluteCenter>
  );
}
