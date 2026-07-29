import { DialogBody, Text } from "@chakra-ui/react";

interface Props {
    errorMessage: string
}

export function ErrorView({errorMessage}: Props) {
    return (
        <DialogBody>
            <Text>{errorMessage}</Text>
        </DialogBody>
    )
}