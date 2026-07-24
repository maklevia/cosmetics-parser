import { api } from "@fe/api"
import { useState } from "react";

interface HookInput {
    productId: number,
}

interface HookOutput {
    isLoading: boolean;
    deleteProduct: () => Promise<void>
}

export function useDeleteProducts(props: HookInput): HookOutput {
    const {productId} = props;
    const [isLoading, setIsLoading] = useState(false);

    const deleteProduct = async () => {
        try {
            setIsLoading(true);
            await api.delete(`/product/${productId}/delete`);
        } catch (error) {
            console.log('FE: error deleting product from collection: ', error)
        } finally {
            setIsLoading(false);
        }
    }

    return {isLoading, deleteProduct}
}
