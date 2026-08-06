import { api } from "@fe/config/api";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toaster } from "@fe/components/ui/toaster";

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
            if (isAxiosError(error) && error.response && error.response.status < 500) {
                toaster.error({ title: error.response.data?.message || "Failed to generate channel link" });
            }
        }
    }

    return { channelLink, generateChannelLink }
}

