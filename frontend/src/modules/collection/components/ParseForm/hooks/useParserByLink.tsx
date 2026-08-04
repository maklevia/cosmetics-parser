import {api} from "@fe/config/api";
import type { ParseResult } from "@fe/modules/collection/components/ParseForm/types/parsedProduct";
import axios from "axios";
import { useState } from "react";

interface ParseResponse {
  productId: number,
  parsedResults: ParseResult,
}

interface HookOutput {
  isLoading: boolean;
  parse: (link: string) => Promise<ParseResponse | undefined>;
  errorMessage?: string;
}

export const useParserByLink = (): HookOutput => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const parse = async (productLink: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await api.post<ParseResponse>("/product/parse", {
        url: productLink,
      });
      return response.data;
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, parse, errorMessage };
};
