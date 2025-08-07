# Configuración del Servicio de Email

Este documento explica cómo configurar diferentes proveedores de email para el sistema de cotización.

## 🔧 Configuración General

El sistema de email está diseñado para ser modular y soporta múltiples proveedores. La configuración se realiza através de variables de entorno.

### Variables de Entorno Base

Copia `.env.example` a `.env.local` y configura las variables según tu proveedor:

```bash
cp .env.example .env.local
```

## 📧 Proveedores Soportados

### 1. Mock (Desarrollo)

Para desarrollo y testing, usa el proveedor mock que simula el envío de emails:

```env
VITE_EMAIL_PROVIDER=mock
VITE_EMAIL_FROM=noreply@tuempresa.com
VITE_EMAIL_FROM_NAME="Tu Empresa S.L."
```

### 2. SendGrid

**Paso 1**: Instalar dependencia
```bash
pnpm add @sendgrid/mail
```

**Paso 2**: Configurar variables de entorno
```env
VITE_EMAIL_PROVIDER=sendgrid
VITE_EMAIL_API_KEY=SG.tu_api_key_de_sendgrid
VITE_EMAIL_FROM=noreply@tudominio.com
VITE_EMAIL_FROM_NAME="Tu Empresa S.L."
```

**Paso 3**: Habilitar el código en `emailService.ts`
Descomenta las líneas en la clase `SendGridEmailProvider`.

### 3. Resend

**Paso 1**: Instalar dependencia
```bash
pnpm add resend
```

**Paso 2**: Configurar variables de entorno
```env
VITE_EMAIL_PROVIDER=resend
VITE_EMAIL_API_KEY=re_tu_api_key_de_resend
VITE_EMAIL_FROM=noreply@tudominio.com
VITE_EMAIL_FROM_NAME="Tu Empresa S.L."
```

**Paso 3**: Habilitar el código en `emailService.ts`
Descomenta las líneas en la clase `ResendEmailProvider`.

### 4. EmailJS (Cliente)

**Paso 1**: Instalar dependencia
```bash
pnpm add @emailjs/browser
```

**Paso 2**: Configurar variables de entorno
```env
VITE_EMAIL_PROVIDER=emailjs
VITE_EMAILJS_SERVICE_ID=tu_service_id
VITE_EMAILJS_TEMPLATE_ID=tu_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_public_key
VITE_EMAIL_FROM=noreply@tudominio.com
VITE_EMAIL_FROM_NAME="Tu Empresa S.L."
```

**Paso 3**: Habilitar el código en `emailService.ts`
Descomenta las líneas en la clase `EmailJSProvider`.

### 5. Nodemailer (SMTP)

**Paso 1**: Instalar dependencia
```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

**Paso 2**: Configurar variables de entorno
```env
VITE_EMAIL_PROVIDER=nodemailer
VITE_EMAIL_FROM=tu-email@gmail.com
VITE_EMAIL_FROM_NAME="Tu Empresa S.L."
VITE_SMTP_HOST=smtp.gmail.com
VITE_SMTP_PORT=587
VITE_SMTP_SECURE=false
VITE_SMTP_USER=tu-email@gmail.com
VITE_SMTP_PASS=tu_app_password
```

**Paso 3**: Implementar la clase `NodemailerEmailProvider` en `emailService.ts`

## 🛠️ Implementación Personalizada

Para añadir un nuevo proveedor:

1. **Crear una nueva clase** que extienda `EmailProvider`:

```typescript
class TuProveedorEmailProvider extends EmailProvider {
  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Tu implementación aquí
      return { success: true, messageId: 'id-del-mensaje' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

2. **Añadir al factory** en `createEmailProvider()`:

```typescript
export function createEmailProvider(config: EmailConfig): EmailProvider {
  switch (config.provider) {
    case 'tu-proveedor':
      return new TuProveedorEmailProvider(config);
    // ... otros casos
  }
}
```

3. **Actualizar tipos** en `EmailConfig`:

```typescript
export interface EmailConfig {
  provider: 'sendgrid' | 'resend' | 'emailjs' | 'nodemailer' | 'tu-proveedor' | 'mock';
  // ... resto de propiedades
}
```

## 🎨 Personalización de Templates

### Template HTML

Para personalizar el email HTML, modifica la función `generateQuotationEmailTemplate()` en `emailService.ts`.

### Variables disponibles en el template:

- `quotation.id` - ID de la cotización
- `quotation.customerName` - Nombre del cliente
- `quotation.customerEmail` - Email del cliente
- `quotation.customerPhone` - Teléfono del cliente
- `quotation.items[]` - Array de productos
- `quotation.total` - Total de la cotización
- `quotation.notes` - Comentarios adicionales
- `quotation.createdAt` - Fecha de creación

### CSS Inline

El template usa CSS inline para máxima compatibilidad con clientes de email.

## 🔍 Testing

### Probar en desarrollo:
```bash
# Usar el proveedor mock
VITE_EMAIL_PROVIDER=mock npm run dev
```

### Probar con proveedor real:
```bash
# Cambiar a tu proveedor configurado
VITE_EMAIL_PROVIDER=sendgrid npm run dev
```

### Logs de depuración:
El servicio incluye logs detallados en consola para debugging.

## 🚨 Consideraciones de Seguridad

1. **Variables de entorno**: Nunca commitees archivos `.env.local` con claves reales
2. **API Keys**: Usa variables de entorno para las claves de API
3. **Validación**: El servicio incluye validación básica, pero añade validaciones adicionales según tus necesidades
4. **Rate Limiting**: Considera implementar rate limiting para evitar spam

## 📋 Checklist de Configuración

- [ ] Copiado `.env.example` a `.env.local`
- [ ] Configuradas variables del proveedor elegido
- [ ] Instaladas dependencias necesarias
- [ ] Habilitado código del proveedor en `emailService.ts`
- [ ] Probado el envío de emails
- [ ] Personalizado template si es necesario
- [ ] Configurado dominio/email verificado en el proveedor

## 🆘 Troubleshooting

### Email no se envía:
1. Verifica que las variables de entorno estén correctas
2. Revisa la consola para mensajes de error
3. Asegúrate de que el dominio esté verificado en tu proveedor
4. Comprueba que la API key tenga permisos suficientes

### Template se ve mal:
1. Prueba el template en diferentes clientes de email
2. Usa herramientas como Litmus o Email on Acid para testing
3. Mantén CSS inline para mejor compatibilidad

### Errores de CORS (EmailJS):
1. Configura correctamente los dominios permitidos en EmailJS
2. Asegúrate de usar HTTPS en producción

## 📚 Recursos Adicionales

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Resend Documentation](https://resend.com/docs)
- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Email Template Testing](https://www.campaignmonitor.com/css/)
