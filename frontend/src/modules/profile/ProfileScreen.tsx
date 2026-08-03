import { ChannelLinks } from "@fe/modules/profile/components/TelegramLink/ChannelLinks";
import { useProfile } from "@fe/modules/profile/hooks/useProfile";
import { AbsoluteCenter, Stack, Text } from "@chakra-ui/react";
import { Header } from "@fe/components/layouts/Header/Header";

export function ProfileScreen() {
  const { userInfo } = useProfile();

  return (
    <>
    <Header />
    <AbsoluteCenter>
      <Stack>
        {userInfo?.isTelegramConnected ? (
          <Text>You've connected your telegram ✅</Text>
        ) : (
          <ChannelLinks />
        )}
      </Stack>
    </AbsoluteCenter></>
    
  );
}
