import { DialogBody, Text } from "@chakra-ui/react";

export function ErrorView({errorMessage}: {errorMessage: string}) {
    return (
        <DialogBody>
            <Text>{errorMessage}</Text>
        </DialogBody>
    )
}