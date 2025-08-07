import type { QuotationRequest } from '@/interfaces/quotation';

// Tipos para la configuración de email
export interface EmailConfig {
    provider: 'sendgrid' | 'nodemailer' | 'resend' | 'emailjs' | 'mock';
    apiKey?: string;
    fromEmail: string;
    fromName: string;
    smtpConfig?: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
}

export interface EmailTemplate {
    subject: string;
    htmlContent: string;
    textContent: string;
}

export interface EmailAttachment {
    filename: string;
    content: string | Buffer;
    contentType?: string;
}

export interface SendEmailOptions {
    to: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
    attachments?: EmailAttachment[];
    templateData?: Record<string, any>;
}

// Clase base para los proveedores de email
export abstract class EmailProvider {
    protected config: EmailConfig;

    constructor(config: EmailConfig) {
        this.config = config;
    }

    abstract sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Implementación mock para desarrollo
class MockEmailProvider extends EmailProvider {
    async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
        console.log('📧 Mock Email Service - Enviando email:');
        console.log('- To:', options.to);
        console.log('- Subject:', options.subject);
        console.log('- HTML Content:', options.htmlContent.substring(0, 100) + '...');

        if (options.attachments && options.attachments.length > 0) {
            console.log('- Attachments:', options.attachments.map(att => att.filename));
        }

        // Simular delay de envío
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simular éxito en el 95% de los casos
        const success = Math.random() > 0.05;

        if (success) {
            return {
                success: true,
                messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            };
        } else {
            return {
                success: false,
                error: 'Mock error: Email service temporarily unavailable'
            };
        }
    }
}

// Implementación para SendGrid (preparada para uso real)
class SendGridEmailProvider extends EmailProvider {
    async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            // Aquí irá la implementación real de SendGrid
            /* 
            import sgMail from '@sendgrid/mail';
            
            sgMail.setApiKey(this.config.apiKey!);
            
            const msg = {
              to: options.to,
              from: {
                email: this.config.fromEmail,
                name: this.config.fromName
              },
              subject: options.subject,
              html: options.htmlContent,
              text: options.textContent,
              attachments: options.attachments?.map(att => ({
                filename: att.filename,
                content: att.content,
                type: att.contentType || 'application/octet-stream'
              }))
            };
            
            const response = await sgMail.send(msg);
            return {
              success: true,
              messageId: response[0].headers['x-message-id']
            };
            */

            // Por ahora, usar mock
            console.log('⚠️  SendGrid no configurado, usando mock');
            return await new MockEmailProvider(this.config).sendEmail(options);

        } catch (error) {
            console.error('SendGrid Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown SendGrid error'
            };
        }
    }
}

// Implementación para Resend (preparada para uso real)
class ResendEmailProvider extends EmailProvider {
    async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            // Aquí irá la implementación real de Resend
            /* 
            import { Resend } from 'resend';
            
            const resend = new Resend(this.config.apiKey);
            
            const response = await resend.emails.send({
              from: `${this.config.fromName} <${this.config.fromEmail}>`,
              to: options.to,
              subject: options.subject,
              html: options.htmlContent,
              text: options.textContent,
              attachments: options.attachments?.map(att => ({
                filename: att.filename,
                content: att.content
              }))
            });
            
            return {
              success: true,
              messageId: response.data?.id
            };
            */

            // Por ahora, usar mock
            console.log('⚠️  Resend no configurado, usando mock');
            return await new MockEmailProvider(this.config).sendEmail(options);

        } catch (error) {
            console.error('Resend Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Resend error'
            };
        }
    }
}

// Implementación para EmailJS (cliente)
class EmailJSProvider extends EmailProvider {
    async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
        try {
            // Aquí irá la implementación real de EmailJS
            /* 
            import emailjs from '@emailjs/browser';
            
            const templateParams = {
              to_email: options.to,
              subject: options.subject,
              html_content: options.htmlContent,
              ...options.templateData
            };
            
            const response = await emailjs.send(
              'YOUR_SERVICE_ID',
              'YOUR_TEMPLATE_ID',
              templateParams,
              'YOUR_PUBLIC_KEY'
            );
            
            return {
              success: true,
              messageId: response.text
            };
            */

            // Por ahora, usar mock
            console.log('⚠️  EmailJS no configurado, usando mock');
            return await new MockEmailProvider(this.config).sendEmail(options);

        } catch (error) {
            console.error('EmailJS Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown EmailJS error'
            };
        }
    }
}

// Factory para crear el proveedor apropiado
export function createEmailProvider(config: EmailConfig): EmailProvider {
    switch (config.provider) {
        case 'sendgrid':
            return new SendGridEmailProvider(config);
        case 'resend':
            return new ResendEmailProvider(config);
        case 'emailjs':
            return new EmailJSProvider(config);
        case 'mock':
        default:
            return new MockEmailProvider(config);
    }
}

// Servicio principal de email
class EmailService {
    private provider: EmailProvider;

    constructor(config: EmailConfig) {
        this.provider = createEmailProvider(config);
    }

    // Generar template HTML para cotización
    private generateQuotationEmailTemplate(quotation: QuotationRequest): EmailTemplate {
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

        const itemsHtml = quotation.items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.productName}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${formatPrice(item.productPrice)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${formatPrice(item.subtotal)}
        </td>
      </tr>
    `).join('');

        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cotización Recibida</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Su Empresa S.L.</h1>
          <p style="color: #6b7280; margin: 0;">Cotización Recibida</p>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #059669; margin-top: 0;">¡Hemos recibido su solicitud de cotización!</h2>
          <p>Estimado/a ${quotation.customerName},</p>
          <p>Gracias por su interés en nuestros productos. Hemos recibido su solicitud de cotización y nuestro equipo comercial la está revisando.</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Detalles de la Cotización</h3>
          <table style="width: 100%; margin-bottom: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Número de Cotización:</td>
              <td style="padding: 8px 0; font-family: monospace;">${quotation.id}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Fecha:</td>
              <td style="padding: 8px 0;">${formatDate(quotation.createdAt)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Estado:</td>
              <td style="padding: 8px 0;"><span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px;">PENDIENTE</span></td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Productos Cotizados</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">Producto</th>
                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">Precio Unit.</th>
                <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">Cantidad</th>
                <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e5e7eb;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f9fafb; font-weight: bold;">
                <td colspan="3" style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;">TOTAL:</td>
                <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; font-size: 18px; color: #059669;">${formatPrice(quotation.total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${quotation.notes ? `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Comentarios</h3>
          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
            ${quotation.notes}
          </div>
        </div>
        ` : ''}

        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1d4ed8; margin-top: 0;">Próximos Pasos</h3>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Nuestro equipo revisará su solicitud en las próximas 24 horas</li>
            <li style="margin-bottom: 8px;">Un asesor comercial se pondrá en contacto con usted</li>
            <li style="margin-bottom: 8px;">Recibirá una cotización detallada con precios y condiciones</li>
          </ol>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center;">
          <h3 style="color: #374151; margin-top: 0;">Información de Contacto</h3>
          <p style="margin: 5px 0;"><strong>Email:</strong> ventas@empresa.com</p>
          <p style="margin: 5px 0;"><strong>Teléfono:</strong> +34 123 456 789</p>
          <p style="margin: 5px 0;"><strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>Este email fue enviado automáticamente. Por favor, no responda a esta dirección.</p>
          <p>© 2025 Su Empresa S.L. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `;

        const textContent = `
Cotización Recibida - ${quotation.id}

Estimado/a ${quotation.customerName},

Hemos recibido su solicitud de cotización con los siguientes detalles:

INFORMACIÓN DE LA COTIZACIÓN:
- Número: ${quotation.id}
- Fecha: ${formatDate(quotation.createdAt)}
- Estado: Pendiente

PRODUCTOS COTIZADOS:
${quotation.items.map(item =>
            `- ${item.productName}: ${formatPrice(item.productPrice)} x ${item.quantity} = ${formatPrice(item.subtotal)}`
        ).join('\n')}

TOTAL: ${formatPrice(quotation.total)}

${quotation.notes ? `COMENTARIOS:\n${quotation.notes}\n` : ''}

PRÓXIMOS PASOS:
1. Nuestro equipo revisará su solicitud en las próximas 24 horas
2. Un asesor comercial se pondrá en contacto con usted
3. Recibirá una cotización detallada con precios y condiciones

CONTACTO:
Email: ventas@empresa.com
Teléfono: +34 123 456 789
Horario: Lunes a Viernes, 9:00 - 18:00

Gracias por confiar en nosotros.

Su Empresa S.L.
    `;

        return {
            subject: `Cotización Recibida - ${quotation.id}`,
            htmlContent,
            textContent
        };
    }

    // Enviar email de confirmación de cotización
    async sendQuotationConfirmation(quotation: QuotationRequest): Promise<{ success: boolean; messageId?: string; error?: string }> {
        const template = this.generateQuotationEmailTemplate(quotation);

        return await this.provider.sendEmail({
            to: quotation.customerEmail,
            subject: template.subject,
            htmlContent: template.htmlContent,
            textContent: template.textContent
        });
    }

    // Enviar email personalizado
    async sendCustomEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
        return await this.provider.sendEmail(options);
    }
}

// Configuración por defecto (usando variables de entorno)
const defaultConfig: EmailConfig = {
    provider: (import.meta.env.VITE_EMAIL_PROVIDER as EmailConfig['provider']) || 'mock',
    apiKey: import.meta.env.VITE_EMAIL_API_KEY,
    fromEmail: import.meta.env.VITE_EMAIL_FROM || 'noreply@empresa.com',
    fromName: import.meta.env.VITE_EMAIL_FROM_NAME || 'Su Empresa S.L.',
    smtpConfig: import.meta.env.VITE_SMTP_HOST ? {
        host: import.meta.env.VITE_SMTP_HOST,
        port: parseInt(import.meta.env.VITE_SMTP_PORT || '587'),
        secure: import.meta.env.VITE_SMTP_SECURE === 'true',
        auth: {
            user: import.meta.env.VITE_SMTP_USER || '',
            pass: import.meta.env.VITE_SMTP_PASS || ''
        }
    } : undefined
};

// Instancia singleton del servicio
export const emailService = new EmailService(defaultConfig);

// Exportar tipos y clases para extensibilidad
export { EmailService };
