import api from "@/api";
import type { ParsedProducts } from "@/components/collection/collectionScreen/parseProductDialog/types/parsedProduct";
import axios from "axios";
import { useState } from "react";

interface HookOutput {
  isLoading: boolean;
  parse: (link: string) => Promise<void>;
  results: ParsedProducts | null;
  errorMessage?: string;
}

export const useParserByLink = (): HookOutput => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ParsedProducts | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const parse = async (productLink: string) => {
    try {
      setIsLoading(true);
      const response = await api.post<ParsedProducts>("/product/parse", {
        url: productLink,
      });
      const parsedProducts = response.data;
      setResults(parsedProducts);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage(
            "Could not connect to the server. Please, try again later.",
          );
        }
      } else {
        setErrorMessage("Something went wrong. Please, try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, parse, results, errorMessage };
};
