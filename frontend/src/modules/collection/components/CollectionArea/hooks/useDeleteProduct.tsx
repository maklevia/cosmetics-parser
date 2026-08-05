import { api } from "@fe/config/api"
import { isAxiosError } from "axios";
import { useState } from "react";
import { toaster } from "@fe/components/ui/toaster";

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
            if (isAxiosError(error) && error.response && error.response.status < 500) {
                toaster.error({ title: error.response.data?.message || "Error deleting product" });
            }
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return {isLoading, deleteProduct}
}

