import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Loader2, Package, Minus, Plus, X } from "lucide-react"
import { useState } from "react"
import { useQuotationStore } from "@/stores/quotationStore"
import { Badge } from "@/components/ui/badge"
import LazyImage from "@/components/LazyImage"
import type { QuotationFormData } from "@/interfaces/quotation"
import { emailService } from "@/services/emailService"
import { useEmailNotifications } from "@/hooks/useEmailNotifications"
import { Notification } from "@/components/Notification"

interface QuotationModalProps {
    children?: React.ReactNode;
    onSuccess?: (quotationId: string) => void;
}

export function QuotationModal({ children, onSuccess }: QuotationModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<QuotationFormData>({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: ''
    })

    const {
        items,
        createQuotation,
        removeItem,
        updateQuantity,
        getTotal,
        getItemCount
    } = useQuotationStore()

    const {
        notification,
        showEmailSuccess,
        showEmailError,
        hideNotification
    } = useEmailNotifications()

    const handleInputChange = (field: keyof QuotationFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateForm = (): boolean => {
        return !!(
            formData.customerName.trim() &&
            formData.customerEmail.trim() &&
            formData.customerPhone.trim() &&
            items.length > 0
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            // Crear la cotización
            const quotation = createQuotation(formData)

            // Enviar email de confirmación
            console.log('📧 Enviando email de confirmación...');
            const emailResult = await emailService.sendQuotationConfirmation(quotation);

            if (emailResult.success) {
                console.log('✅ Email enviado exitosamente:', emailResult.messageId);
                showEmailSuccess(emailResult.messageId);
            } else {
                console.warn('⚠️ Error al enviar email:', emailResult.error);
                showEmailError(emailResult.error || 'Error desconocido');
            }

            // Limpiar formulario
            setFormData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                notes: ''
            })

            setOpen(false)
            onSuccess?.(quotation.id)

        } catch (error) {
            console.error('Error creating quotation:', error)
            showEmailError('Error al procesar la cotización');
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price)
    }

    return (
        <>
            {/* Notificación de estado del email */}
            {notification && (
                <div className="fixed top-4 right-4 z-[100] max-w-md">
                    <Notification
                        notification={notification}
                        onClose={hideNotification}
                    />
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children || (
                        <Button className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Solicitar Cotización
                            {getItemCount() > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {getItemCount()}
                                </Badge>
                            )}
                        </Button>
                    )}
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Solicitar Cotización
                        </DialogTitle>
                        <DialogDescription>
                            Complete sus datos para recibir una cotización personalizada.
                            Le enviaremos la información por correo electrónico.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Productos en la cotización */}
                        {items.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-sm">Productos a cotizar:</h3>
                                <div className="max-h-48 overflow-y-auto space-y-3 border rounded-md p-3">
                                    {items.map((item) => (
                                        <div key={item.productId} className="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
                                            {item.productImage && (
                                                <LazyImage
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatPrice(item.productPrice)} × {item.quantity}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>

                                                <span className="w-8 text-center text-sm">{item.quantity}</span>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 w-7 p-0"
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 w-7 p-0 ml-2"
                                                    onClick={() => removeItem(item.productId)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-medium text-sm">
                                                    {formatPrice(item.subtotal)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t font-medium">
                                    <span>Total estimado:</span>
                                    <span className="text-lg">{formatPrice(getTotal())}</span>
                                </div>
                            </div>
                        )}

                        {/* Información del cliente */}
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="customerName">Nombre completo *</Label>
                                <Input
                                    id="customerName"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.customerName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('customerName', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customerEmail">Correo electrónico *</Label>
                                <Input
                                    id="customerEmail"
                                    type="email"
                                    placeholder="Ej: juan@empresa.com"
                                    value={formData.customerEmail}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('customerEmail', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customerPhone">Teléfono *</Label>
                                <Input
                                    id="customerPhone"
                                    type="tel"
                                    placeholder="Ej: +34 123 456 789"
                                    value={formData.customerPhone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('customerPhone', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Comentarios adicionales (opcional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Indique cualquier requisito especial, fechas de entrega, condiciones comerciales, etc."
                                    value={formData.notes}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={!validateForm() || loading}
                                className="min-w-[120px]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Enviar Solicitud
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
