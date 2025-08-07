import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuotationItem, QuotationRequest } from '@/interfaces/quotation';
import type Product from '@/interfaces/product';

interface QuotationStore {
    items: QuotationItem[];
    quotations: QuotationRequest[];

    // Acciones para el carrito de cotización
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearItems: () => void;

    // Acciones para las cotizaciones
    createQuotation: (customerData: { customerName: string; customerEmail: string; customerPhone: string; notes?: string }) => QuotationRequest;
    getQuotation: (id: string) => QuotationRequest | undefined;

    // Getters
    getTotal: () => number;
    getItemCount: () => number;
}

type QuotationStoreState = QuotationStore;

export const useQuotationStore = create<QuotationStore>()(
    persist(
        (set, get) => ({
            items: [],
            quotations: [],

            addItem: (product: Product, quantity = 1) => {
                set((state: QuotationStoreState) => {
                    const existingItem = state.items.find((item: QuotationItem) => item.productId === product.id);

                    if (existingItem) {
                        return {
                            items: state.items.map((item: QuotationItem) =>
                                item.productId === product.id
                                    ? {
                                        ...item,
                                        quantity: item.quantity + quantity,
                                        subtotal: (item.quantity + quantity) * item.productPrice
                                    }
                                    : item
                            )
                        };
                    } else {
                        const newItem: QuotationItem = {
                            productId: product.id,
                            productName: product.name,
                            productPrice: product.price,
                            quantity,
                            subtotal: product.price * quantity,
                            productImage: product.picture?.[0]?.url
                        };

                        return {
                            items: [...state.items, newItem]
                        };
                    }
                });
            },

            removeItem: (productId: number) => {
                set((state: QuotationStoreState) => ({
                    items: state.items.filter((item: QuotationItem) => item.productId !== productId)
                }));
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }

                set((state: QuotationStoreState) => ({
                    items: state.items.map((item: QuotationItem) =>
                        item.productId === productId
                            ? {
                                ...item,
                                quantity,
                                subtotal: quantity * item.productPrice
                            }
                            : item
                    )
                }));
            },

            clearItems: () => {
                set({ items: [] });
            },

            createQuotation: (customerData: { customerName: string; customerEmail: string; customerPhone: string; notes?: string }) => {
                const quotationId = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const items = get().items;
                const total = get().getTotal();

                const newQuotation: QuotationRequest = {
                    id: quotationId,
                    customerName: customerData.customerName,
                    customerEmail: customerData.customerEmail,
                    customerPhone: customerData.customerPhone,
                    items: [...items],
                    total,
                    createdAt: new Date().toISOString(),
                    status: 'pending',
                    notes: customerData.notes
                };

                set((state: QuotationStoreState) => ({
                    quotations: [...state.quotations, newQuotation],
                    items: [] // Limpiar el carrito después de crear la cotización
                }));

                return newQuotation;
            },

            getQuotation: (id: string) => {
                return get().quotations.find((quotation: QuotationRequest) => quotation.id === id);
            },

            getTotal: () => {
                return get().items.reduce((total: number, item: QuotationItem) => total + item.subtotal, 0);
            },

            getItemCount: () => {
                return get().items.reduce((count: number, item: QuotationItem) => count + item.quantity, 0);
            }
        }),
        {
            name: 'quotation-storage',
            partialize: (state) => ({
                items: state.items,
                quotations: state.quotations
            }),
        }
    )
);
