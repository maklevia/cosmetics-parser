import { AbsoluteCenter, Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
    return (
        <AbsoluteCenter>
            <Stack>
                {children}
            </Stack>
        </AbsoluteCenter>
    )

}