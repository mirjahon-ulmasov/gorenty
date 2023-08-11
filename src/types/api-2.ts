/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
/* eslint-disable @typescript-eslint/no-namespace */
export type BucketFile = {
    id: number;
    file: string;
};

export type Pagination = Partial<{
    page: number;
    page_size: number;
}>;

export type ResultList<T> = Partial<{
    count: number;
    next: string;
    previous: string;
    results: T[];
}>;

export declare module Brand {
    export type List = DTO[];

    export interface DTO {
        id: number;
        title: string;
        image: BucketFile;
    }

    export interface Params {
        search?: string;
    }
}

export declare module Catalogue {
    export type List = ResultList<DTO>;

    export interface DTO {
        id: number;
        brand: Brand;
        file: BucketFile;
        title: string;
        file_type: string;
        size: string;
    }

    export interface Brand {
        id: number;
        title: string;
        image: BucketFile;
    }

    export interface Params extends Pagination {
        file_type: string;
        begin_date: string;
        end_date: string;
        search: string;
    }
}

export declare module CompanyHistory {
    export type List = DTO[];

    export interface DTO {
        id: number;
        title: string;
        image: BucketFile;
        year: string;
        content: string;
    }

    export interface Params {
        search?: string;
    }
}

export declare module Product {
    export type List = ResultList<DTO>;
    export type DiscountsList = ResultList<DTO>;
    export type PromotionsList = ResultList<DTO>;
    export type InstructionsList = ResultList<InstructionsDTO>;

    export interface DTO {
        id: number;
        title: string;
        default_variant_code: string;
        category: Category;
        default_image: BucketFile;
        metadata: Category[];
    }

    export interface Category {
        id: number;
        title: string;
    }

    export type Params = Pagination &
        Partial<{
            is_new: boolean;
            is_recommended: boolean;
            is_hot: boolean;
            search: string;
            region: number;
        }>;
    export type DiscountsParams = Pagination & Partial<{ search: string; }>;
    export type PromotionsParams = Pagination & Partial<{ search: string; }>;
    export type InstructionsParams = Pagination & Partial<{ search: string; }>;
    
    export type InstructionsDTO = {
        id?: number;
        title: string;
        default_variant_code?: string;
        default_image?: BucketFile;
        lifetime: string;
    };
}

export declare module HomepageStats {
    export interface DTO {
        first_indicator: string;
        second_indicator: string;
        third_indicator: string;
        fourth_indicator: string;
    }
}

export declare module News {
    export type List = ResultList<DTO>;

    export type DTO = Partial<{
        id: number;
        title: string;
        content: string;
        main_image: BucketFile;
    }>;

    export interface Params extends Pagination {
        search: string;
        add_to_carousel: string | boolean;
    }
}

export declare module Guarantee {
    export type List = ResultList<DTO>;

    export interface DTO {
        id: number;
        category: Category;
        warranty_period: number;
        free_service_period: number;
        lifetime: number;
    }

    export interface Category {
        id: number;
        title: string;
    }

    export interface Params extends Pagination {
        brand: string;
        search: string;
    }
}

export declare module Service {
    export type List = DTO[];
    export type RegionsList = Region[];

    export interface DTO {
        id: number;
        title: string;
        region: Region;
        phone_number: string;
        latitude: string;
        longitude: string;
    }

    export interface Region {
        id: number;
        title: string;
    }

    export interface Params {
        region: number;
        search?: string;
    }
}

export declare module Store {
    export type StoreList = Store[];

    export interface Store {
        id: number;
        title: string;
        latitude: string;
        longitude: string;
    }

    export interface Params {
        region: string;
        search?: string;
    }

}

export declare module Location {
    export interface DTO {
        city: string,
        continent_code: string,
        continent_name: string,
        country_code: string,
        country_name: string,
        dma_code: any,
        is_in_european_union: boolean,
        latitude: number,
        longitude: number,
        postal_code: any,
        region: string,
        time_zone: string
    }

}
