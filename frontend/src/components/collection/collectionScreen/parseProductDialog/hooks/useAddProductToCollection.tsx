import api from "@/api";
import type { ParseResult } from "@/components/collection/collectionScreen/parseProductDialog/types/parsedProduct";
import axios from "axios";
import { useState } from "react";

interface HookInput {
  parseResult: ParseResult;
  onSuccess: () => void;
  onFailure: (message: string) => void;
}
interface HookOutput {
  add: () => void;
  isLoading: boolean;
}

export const useAddProductToCollection = ({
  parseResult,
  onSuccess,
  onFailure,
}: HookInput): HookOutput => {
  const [isLoading, setIsLoading] = useState(false);
  const add = async () => {
    try {
      setIsLoading(true);
      await api.post("/product/add-product-to-collection", { parseResult });
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
