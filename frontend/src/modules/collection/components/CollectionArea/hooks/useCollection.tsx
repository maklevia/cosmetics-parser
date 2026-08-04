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
    const getInitialProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<{ collection: CollectionProduct[] }>(
          "/product/collection",
          {
            params: { all: false },
          },
        );
        setProducts(response.data.collection);

        setSeeAll(false);
      } catch (error) {
        console.log("Something went wrong: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getInitialProducts();
  }, [refreshCount]);

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
    } catch (error) {
      console.log("Something went wrong: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hideRestProducts = async () => {
    try {
      const initialProducts = products.slice(0, 8);
      setProducts(initialProducts);
    } catch (error) {
      console.log(error);
    }
  };

  return { isLoading, products, getRestProducts, hideRestProducts };
}
