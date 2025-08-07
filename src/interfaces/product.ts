export default interface Product {
    id: number;
    documentId: string;
    description: string | null;
    detailed_description: string | null;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    picture: {
        id: number;
        name: string;
        url: string;
        alternativeText?: string;
        width: number;
        height: number;
        formats?: {
            thumbnail?: {
                name: string;
                hash: string;
                ext: string;
                mime: string;
                path: string | null;
                width: number;
                height: number;
                size: number;
                sizeInBytes: number;
                url: string;
            };
        };
        hash: string;
        ext: string;
        mime: string;
        size: number;
        provider?: string;
        provider_metadata?: any;
        createdAt?: string;
        updatedAt?: string;
        publishedAt?: string;
    }[] | null;
    localizations: any[];
}