import { api } from "@fe/config/api"
import type { ParsedProducts } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import { useState, useCallback } from "react";

interface HookOutput {
    isLoading: boolean;
    productDetails: ParsedProducts | undefined;
    showDetails: (productId: number) => Promise<void>;
}

export function useProductDetails(): HookOutput {
    const [productDetails, setProductDetails] = useState<ParsedProducts>();
    const [isLoading, setIsLoading] = useState(false)

    const showDetails = useCallback(async (productId: number) => {
        try {
            setIsLoading(true)
            const response = await api.get(`/product/${productId}/details`);
            const fetchedDetails: ParsedProducts = response.data.storeRecords;
            setProductDetails(fetchedDetails);
        } catch (error) {
            console.log('FE: error getting response for product details: ', error);
        } finally {
            setIsLoading(false)
        }
    }, []);

    return {isLoading, productDetails, showDetails}
}
