import { Product } from "@parsers/types/Product.js";

interface EvaProduct {
    name: string;
    brand: string;
    final_price: number;
    stock: {
        is_in_stock: boolean;
    };
    image: string;
    id: number;
}

export interface EvaByLinkResponse {
    data: {
        product: EvaProduct | null;
    };
}

export interface EvaSearchResponse {
    data: {
        hits: EvaProduct[];
    };
}
