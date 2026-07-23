import { ChannelLinks } from "@/components/profile/components/TelegramLink/ChannelLinks";
import { AbsoluteCenter, Stack } from "@chakra-ui/react";

export function ProfileScreen() {

    return (
        <AbsoluteCenter>
            <Stack>
                <ChannelLinks />
            </Stack>
        </AbsoluteCenter>
    )
}
