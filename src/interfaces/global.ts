/**
 * Represents different image format sizes available for media files
 */
interface MediaFormat {
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
}

/**
 * Complete media/image object structure from Strapi
 */
interface MediaFile {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
        thumbnail?: MediaFormat;
        small?: MediaFormat;
        medium?: MediaFormat;
        large?: MediaFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

/**
 * SEO metadata structure for pages
 */
interface SeoMetadata {
    id: number;
    metaTitle: string;
    metaDescription: string;
}

/**
 * Main global configuration interface containing site-wide settings
 */
export default interface Global {
    id: number;
    documentId: string;
    siteName: string;
    siteDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    favicon: MediaFile;
    defaultSeo: SeoMetadata;
}

/**
 * API response wrapper for global configuration data
 */
export interface GlobalApiResponse {
    data: Global;
    meta: Record<string, unknown>;
}

// Export additional interfaces for reuse in other parts of the application
export type { MediaFile, MediaFormat, SeoMetadata };