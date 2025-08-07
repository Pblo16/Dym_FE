import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useQuotationStore } from "@/stores/quotationStore"
import { CheckCircle, Download, Mail, Phone, FileText, Calendar, Package, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import LazyImage from "@/components/LazyImage"
import { jsPDF } from "jspdf"

interface QuotationSuccessProps {
    quotationId?: string;
}

export function QuotationSuccess({ quotationId: propQuotationId }: QuotationSuccessProps) {
    const { id: paramQuotationId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const quotationId = propQuotationId || paramQuotationId;

    const { getQuotation } = useQuotationStore();
    const [emailSent, setEmailSent] = useState(false);

    const quotation = quotationId ? getQuotation(quotationId) : null;

    useEffect(() => {
        if (quotationId && quotation) {
            // Simular envío de email
            const timer = setTimeout(() => {
                setEmailSent(true);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [quotationId, quotation]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    const generatePDF = () => {
        if (!quotation) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        // Header
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text('COTIZACIÓN', pageWidth / 2, 20, { align: 'center' });

        // Company info
        doc.setFontSize(12);
        doc.text('Su Empresa S.L.', 20, 35);
        doc.text('Calle Principal, 123', 20, 42);
        doc.text('28001 Madrid, España', 20, 49);
        doc.text('Tel: +34 123 456 789', 20, 56);
        doc.text('Email: ventas@empresa.com', 20, 63);

        // Quotation info
        doc.setFontSize(10);
        doc.text(`Cotización N°: ${quotation.id}`, pageWidth - 20, 35, { align: 'right' });
        doc.text(`Fecha: ${formatDate(quotation.createdAt)}`, pageWidth - 20, 42, { align: 'right' });
        doc.text(`Estado: ${quotation.status.toUpperCase()}`, pageWidth - 20, 49, { align: 'right' });

        // Customer info
        doc.setFontSize(12);
        doc.text('DATOS DEL CLIENTE:', 20, 80);
        doc.setFontSize(10);
        doc.text(`Nombre: ${quotation.customerName}`, 20, 90);
        doc.text(`Email: ${quotation.customerEmail}`, 20, 97);
        doc.text(`Teléfono: ${quotation.customerPhone}`, 20, 104);

        // Products table
        let yPosition = 125;
        doc.setFontSize(12);
        doc.text('PRODUCTOS COTIZADOS:', 20, yPosition);

        yPosition += 15;
        doc.setFontSize(10);

        // Table headers
        doc.text('Producto', 20, yPosition);
        doc.text('Precio Unit.', 100, yPosition);
        doc.text('Cantidad', 130, yPosition);
        doc.text('Subtotal', 160, yPosition);

        yPosition += 5;
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;

        // Products
        quotation.items.forEach((item) => {
            doc.text(item.productName, 20, yPosition);
            doc.text(formatPrice(item.productPrice), 100, yPosition);
            doc.text(item.quantity.toString(), 130, yPosition);
            doc.text(formatPrice(item.subtotal), 160, yPosition);
            yPosition += 8;
        });

        // Total
        yPosition += 10;
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
        doc.setFontSize(12);
        doc.text(`TOTAL: ${formatPrice(quotation.total)}`, pageWidth - 20, yPosition, { align: 'right' });

        // Notes
        if (quotation.notes) {
            yPosition += 20;
            doc.setFontSize(10);
            doc.text('COMENTARIOS:', 20, yPosition);
            yPosition += 8;
            const splitNotes = doc.splitTextToSize(quotation.notes, pageWidth - 40);
            doc.text(splitNotes, 20, yPosition);
        }

        // Footer
        yPosition = doc.internal.pageSize.height - 30;
        doc.setFontSize(8);
        doc.text('Esta cotización es válida por 30 días desde su fecha de emisión.', pageWidth / 2, yPosition, { align: 'center' });
        doc.text('Precios sujetos a cambios sin previo aviso.', pageWidth / 2, yPosition + 7, { align: 'center' });

        doc.save(`Cotizacion-${quotation.id}.pdf`);
    };

    if (!quotation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Cotización no encontrada</h2>
                <p className="text-muted-foreground mb-4">
                    La cotización solicitada no existe o ha sido eliminada.
                </p>
                <Button onClick={() => navigate('/products')}>
                    Volver al catálogo
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Success Header */}
            <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-green-800">
                                ¡Cotización enviada exitosamente!
                            </h1>
                            <p className="text-green-700">
                                Su solicitud ha sido procesada y enviada a nuestro equipo comercial.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Email Status */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                        <Mail className={`w-6 h-6 ${emailSent ? 'text-green-600' : 'text-blue-600'}`} />
                        <div>
                            <p className="font-medium">
                                {emailSent ? 'Correo enviado' : 'Enviando correo...'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {emailSent
                                    ? `Se ha enviado una copia de la cotización a ${quotation.customerEmail}`
                                    : 'Preparando el envío de la cotización por correo electrónico...'
                                }
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quotation Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Detalles de la Cotización
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Quotation Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Número de Cotización</p>
                            <p className="font-mono font-medium">{quotation.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Fecha</p>
                            <p className="font-medium">{formatDate(quotation.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Estado</p>
                            <Badge variant="outline" className="capitalize">
                                {quotation.status === 'pending' ? 'Pendiente' : quotation.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="font-bold text-lg">{formatPrice(quotation.total)}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Info */}
                    <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Información del Cliente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Nombre</p>
                                <p className="font-medium">{quotation.customerName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium">{quotation.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Teléfono</p>
                                <p className="font-medium">{quotation.customerPhone}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Products */}
                    <div>
                        <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Productos Cotizados
                        </h3>
                        <div className="space-y-3">
                            {quotation.items.map((item) => (
                                <div key={item.productId} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                    {item.productImage && (
                                        <LazyImage
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-16 h-16 rounded object-cover"
                                        />
                                    )}

                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.productName}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            {formatPrice(item.productPrice)} × {item.quantity} unidades
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold">{formatPrice(item.subtotal)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {quotation.notes && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-medium mb-2">Comentarios</h3>
                                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                    {quotation.notes}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    onClick={generatePDF}
                    className="flex-1"
                    variant="default"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                </Button>

                <Button
                    onClick={() => navigate('/products')}
                    variant="outline"
                    className="flex-1"
                >
                    <Package className="w-4 h-4 mr-2" />
                    Continuar comprando
                </Button>

                <Button
                    onClick={() => window.open(`tel:${quotation.customerPhone}`)}
                    variant="outline"
                    className="flex-1"
                >
                    <Phone className="w-4 h-4 mr-2" />
                    Contactar
                </Button>
            </div>

            {/* Next Steps */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Próximos Pasos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <p className="font-medium">Revisión comercial</p>
                                <p className="text-muted-foreground">Nuestro equipo revisará su solicitud en las próximas 24 horas.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <p className="font-medium">Contacto personalizado</p>
                                <p className="text-muted-foreground">Un asesor se pondrá en contacto para ajustar la cotización según sus necesidades.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <p className="font-medium">Propuesta final</p>
                                <p className="text-muted-foreground">Recibirá una cotización detallada con precios, términos y condiciones.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
