import { api } from "@fe/config/api";
import { useState } from "react";

interface HookOutput {
    channelLink: string;
    generateChannelLink: (channelName: string) => void;
}

interface LinkResponse {
    channelLink: string;
}

export function useGenerateChannelLink(): HookOutput {
    const [channelLink, setChannelLink] = useState('');

    const generateChannelLink = async (channelName: string) => {
        try {
            const response = await api.get<LinkResponse>(`/channel/${channelName}/generateLink`);
            setChannelLink(response.data.channelLink);
        } catch (error) {
            console.log('FE: Error generating channel link: ', error)
        }
    }

    return { channelLink, generateChannelLink }
}
