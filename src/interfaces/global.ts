export default interface Global {
    id: number;
    documentId: string;
    siteName: string;
    siteDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface GlobalApiResponse {
    data: Global;
    meta: {};
}