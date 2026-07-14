import {api} from "@/api";
import type { ParseResult } from "@/components/collection/screens/ParsePopupForm/types/parsedProduct";
import axios from "axios";
import { useState } from "react";

interface HookOutput {
  isLoading: boolean;
  parse: (link: string) => Promise<void>;
  results: ParseResult | null;
  productId: number | null;
  errorMessage?: string;
}
interface ParseResponse {
  productId: number,
  parsedResults: ParseResult,
}

export const useParserByLink = (): HookOutput => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ParseResult | null>(null);
  const [productId, setProductId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState("");

  const parse = async (productLink: string) => {
    try {
      setIsLoading(true);
      const response = await api.post<ParseResponse>("/product/parse", {
        url: productLink,
      });
      setProductId(response.data.productId);
      setResults(response.data.parsedResults);

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

  return { isLoading, parse, results, productId,errorMessage };
};
