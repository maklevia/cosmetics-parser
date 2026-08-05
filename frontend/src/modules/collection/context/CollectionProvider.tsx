import { useEffect, useState, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { toaster } from "@fe/components/ui/toaster";
import { api } from "@fe/config/api";
import type { CollectionProduct } from "@fe/modules/collection/components/CollectionArea/types/CollectionProduct";
import { CollectionContext } from "@fe/modules/collection/hooks/useCollection";

const PAGE_SIZE = 8;

interface CollectionResponse {
  collection: CollectionProduct[];
  totalCount: number;
}

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const nextPageRef = useRef(2);

  const refreshProducts = useCallback(() => {
    setRefreshCount((c) => c + 1);
  }, []);

  useEffect(() => {
    let ignore = false;
    const getInitialProducts = async () => {
      try {
        setIsInitialLoading(true);
        const response = await api.get<CollectionResponse>(
          "/product/collection",
          { params: { page: 1, limit: PAGE_SIZE } }
        );
        if (ignore) return;
        const { collection, totalCount } = response.data;
        setProducts(collection);
        setHasMore(collection.length < totalCount);
        nextPageRef.current = 2;
      } catch {
        if (ignore) return;
        toaster.error({ title: "Failed to load collection" });
      } finally {
        if (!ignore) setIsInitialLoading(false);
      }
    };
    getInitialProducts();

    return () => { ignore = true; };
  }, [refreshCount]);

  const loadMore = useCallback(async () => {
    try {
      setIsLoadingMore(true);
      const page = nextPageRef.current;
      const response = await api.get<CollectionResponse>(
        "/product/collection",
        { params: { page, limit: PAGE_SIZE } }
      );
      const { collection, totalCount } = response.data;
      setProducts((prev) => [...prev, ...collection]);
      nextPageRef.current = page + 1;
      setHasMore(page * PAGE_SIZE < totalCount);
    } catch {
      toaster.error({ title: "Failed to load more products" });
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  return (
    <CollectionContext.Provider value={{ products, isInitialLoading, isLoadingMore, hasMore, refreshProducts, loadMore }}>
      {children}
    </CollectionContext.Provider>
  );
}
