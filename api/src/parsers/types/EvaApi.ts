interface EvaSwatchOption {
    value: number;
    label: string;
    unit?: string;
    image?: string;
    input_type?: string;
    is_in_stock: boolean;
    is_selected?: boolean;
}

interface EvaSwatchItem {
    label?: string;
    attribute_id?: number;
    options?: EvaSwatchOption[];
}

interface EvaConfigurationInfo {
    name: string;
    final_price?: number;
    price?: number;
    id: number;
    sku?: string;
    is_in_stock: boolean;
    media_gallery?: {
        image: string;
    }[];
}

export interface EvaProduct {
    name: string;
    brand: string;
    final_price?: number;
    stock: {
        is_in_stock: boolean;
    };
    image: string;
    id: number;
    type_id?: string;
    swatches?: {
        items?: EvaSwatchItem[];
        configuration_info?: Record<string, EvaConfigurationInfo>;
    };
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
