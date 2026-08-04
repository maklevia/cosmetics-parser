import { useGenerateChannelLinks } from "@fe/modules/profile/components/ChannelConnectionsCard/hooks/useGenerateChannelLink"
import { Button } from "@chakra-ui/react"
import { FaTelegram } from "react-icons/fa"

export function ChannelLinks() {
    const {channelLink, generateChannelLink} = useGenerateChannelLinks();

    const handleClick = async (channelName: string) => {
        generateChannelLink(channelName);
    }

    return channelLink ? (
        <Button asChild colorPalette="blue" size="sm">
            <a href={channelLink} target="_blank" rel="noreferrer">
                <FaTelegram /> Join Bot
            </a>
        </Button>
    ) : (
        <Button onClick={() => handleClick('telegram')} size="sm" colorPalette="blue" variant="surface">
            Connect
        </Button>
    )
}
