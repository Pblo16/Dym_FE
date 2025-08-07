export interface QuotationItem {
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    subtotal: number;
    productImage?: string;
}

export interface QuotationRequest {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: QuotationItem[];
    total: number;
    createdAt: string;
    status: 'pending' | 'sent' | 'approved' | 'rejected';
    notes?: string;
}

export interface QuotationFormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
}
