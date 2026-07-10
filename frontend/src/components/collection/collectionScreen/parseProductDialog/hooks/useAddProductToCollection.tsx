import api from "@/api";
import type { ParseResult } from "@/components/collection/collectionScreen/parseProductDialog/types/parsedProduct"
import { useState } from "react";

interface HookInput {
    parseResult: ParseResult;
    onSuccess: () => void;
    onFailure: () => void;
}
interface HookOutput {
    add: () => void;
    isLoading: boolean;
}

export const useAddProductToCollection = ({ parseResult, onSuccess, onFailure} : HookInput): HookOutput => {
    const [isLoading, setIsLoading] = useState(false);
    const add = async () => {
        try {
            setIsLoading(true);
            await api.post('/product/add-product-to-collection', { parseResult })
            onSuccess();
        } catch (error) {
            console.log('FE: Error adding product to Collection: ', error)
            onFailure();
        } finally {
            setIsLoading(false);
        }
    }

    return { add, isLoading }
}
