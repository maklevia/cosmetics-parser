import {api} from "@fe/api";
import axios from "axios";
import { useState } from "react";

interface HookInput {
  productId: number;
  onSuccess: () => void;
  onFailure: (message: string) => void;
}
interface HookOutput {
  add: () => void;
  isLoading: boolean;
}

export const useAddProductToCollection = ({
  productId,
  onSuccess,
  onFailure,
}: HookInput): HookOutput => {
  const [isLoading, setIsLoading] = useState(false);
  const add = async () => {
    try {
      setIsLoading(true);
      await api.post("/product/add-product-to-collection", { productId });
      onSuccess();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        onFailure(error.response.data.error);
      } else {
        onFailure("Something went wrong. Please, try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { add, isLoading };
};
