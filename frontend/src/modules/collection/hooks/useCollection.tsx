import { createContext, useContext } from "react";
import type { CollectionProduct } from "@fe/modules/collection/components/CollectionArea/types/CollectionProduct";

export interface CollectionContextType {
  products: CollectionProduct[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  refreshProducts: () => void;
  loadMore: () => Promise<void>;
}

export const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}
