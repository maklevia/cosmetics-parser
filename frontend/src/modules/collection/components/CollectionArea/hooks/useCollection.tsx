import { toaster } from "@fe/components/ui/toaster";
import { api } from "@fe/config/api";
import type { CollectionProduct } from "@fe/modules/collection/components/CollectionArea/types/CollectionProduct";
import { useEffect, useState } from "react";

interface HookOutput {
  isLoading: boolean;
  products: CollectionProduct[];
  getRestProducts: () => void;
  hideRestProducts: () => void;
}
interface HookInput {
  refreshCount: number;
  setSeeAll: React.Dispatch<boolean>;
}

export function useCollection(props: HookInput): HookOutput {
  const { refreshCount, setSeeAll } = props;
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    const getInitialProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<{ collection: CollectionProduct[] }>(
          "/product/collection",
          {
            params: { all: false },
          },
        );
        if (ignore) return;
        setProducts(response.data.collection);

        setSeeAll(false);
      } catch {
        if (ignore) return;
        toaster.error({ title: "Failed to load collection" });
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };
    getInitialProducts();
    
    return () => {
      ignore = true;
    };
  }, [refreshCount, setSeeAll]);

  //need to find a way to store products in cache to not fetch them from db
  //every time. to be implemented.
  const getRestProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ collection: CollectionProduct[] }>(
        "/product/collection",
        {
          params: { all: true },
        },
      );

      const restOfProducts = response.data.collection;

      setProducts((prevProducts) => [...prevProducts, ...restOfProducts]);
    } catch {
      toaster.error({ title: "Failed to load more products" });
    } finally {
      setIsLoading(false);
    }
  };

  const hideRestProducts = async () => {
    try {
      const initialProducts = products.slice(0, 8);
      setProducts(initialProducts);
    } catch {
      toaster.error({ title: "Failed to hide products" });
    }
  };

  return { isLoading, products, getRestProducts, hideRestProducts };
}
