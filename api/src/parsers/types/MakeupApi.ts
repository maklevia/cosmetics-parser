export interface MakeupVariant {
  id: number | string;
  type?: string;
  title: string;
  price?: {
    current: number;
    old?: number;
  } | null;
  inStock: boolean;
  availabilityText?: string;
  region?: string;
  media?: {
    sizes?: {
      sm?: {
        url?: string;
        thumbnail?: string;
      };
    };
  } | null;
  meta?: {
    name?: string;
  } | null;
  link?: string;
}

export interface MakeupProduct {
  id: number;
  title: string;
  type: string;
  subTitle: string;
  brand: {
    title: string;
  };
  price?: {
    current: number;
  } | null;
  inStock: boolean;
  meta?: {
    image: string | null;
  } | null;
  media?: {
    sizes?: {
      sm?: {
        thumbnail?: string;
        url?: string;
      };
    };
  }[] | null;
  hasVariants?: boolean;
  variants?: MakeupVariant[];
  notAvailableVariants?: MakeupVariant[];
  defaultVariant?: MakeupVariant | null;
}

export interface MakeupByLinkResponse extends MakeupProduct {}

export interface MakeupSearchResponse {
  products: MakeupProduct[];
}
