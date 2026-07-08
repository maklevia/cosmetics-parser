import api from "@/api";
import type { StoreName } from "@/types/storeName";
import { useState } from "react";

interface ProductInStoreRecord {
  name: string;
  brand: string;
  inStock: boolean;
  price: number | undefined;
  image?: string;
  storeName: StoreName;
}
interface ParsedProducts {
  eva: ProductInStoreRecord;
  makeup: ProductInStoreRecord;
  notino: ProductInStoreRecord;
}
interface HookOutput {
  isLoading: boolean;
  parse: (link: string) => Promise<void>;
  results: ParsedProducts | null; 
}

export const useParserByLink = (): HookOutput => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ParsedProducts | null>(null);

  const parse = async (productLink: string) => {
    try {
      setIsLoading(true);
      const response = await api.post<ParsedProducts>("/product/parse", {
        url: productLink,
      });
      const parsedProducts = response.data;
      setResults(parsedProducts)

      console.log(parsedProducts.eva);
    } catch (error) {
      console.log("FE: error parsing product: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {isLoading, parse, results}
};
