interface MakeupProduct {
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
  media: { sizes: { sm: { thumbnail: string } } }[];
}

export interface MakeupByLinkResponse extends MakeupProduct {}

export interface MakeupSearchResponse {
  products: MakeupProduct[];
}
