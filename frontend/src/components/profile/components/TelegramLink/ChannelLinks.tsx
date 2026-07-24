import { useGenerateChannelLinks } from "@/components/profile/components/TelegramLink/hooks/useGenerateChannelLink"
import { Button, Link, Stack, Text } from "@chakra-ui/react"

export function ChannelLinks() {
    const {channelLink, generateChannelLink} = useGenerateChannelLinks();

    const handleClick = async (channelName: string) => {
        generateChannelLink(channelName);
    }

    return (
        <Stack>
            <Text>To get telegram notifications about price drops via our bot, click the button below</Text>
            {channelLink ? (
                <Link href={channelLink} target="_blank">Join Telegram Bot</Link>
            ) : (
                <Button onClick={() => handleClick('telegram')}>Generate Telegram link</Button>
            )}
        </Stack>
    )
}
