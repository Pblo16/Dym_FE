# Sistema de Cotización B2B

Un sistema completo de cotización diseñado para empresas B2B que permite a los clientes solicitar cotizaciones personalizadas de productos.

## 🚀 Características Implementadas

### ✅ Sistema de Cotización
- **Modal de solicitud** con formulario completo
- **Carrito de cotización** para múltiples productos
- **Gestión de cantidades** (añadir, editar, eliminar)
- **Validación de formularios** en tiempo real
- **Almacenamiento persistente** con Zustand

### ✅ Servicio de Email
- **Arquitectura modular** que soporta múltiples proveedores
- **Templates HTML responsivos** para emails
- **Sistema de notificaciones** para feedback al usuario
- **Configuración por variables de entorno**
- **Modo mock para desarrollo**

### ✅ Generación de PDF
- **Cotizaciones en PDF** descargables
- **Formato profesional** con datos completos
- **Información de empresa y cliente**
- **Detalle de productos y precios**

### ✅ Interfaz de Usuario
- **Design system consistente** con shadcn/ui
- **Responsive design** para móviles y desktop
- **Estados de carga** y feedback visual
- **Navegación fluida** entre páginas
- **Página de confirmación** detallada

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── QuotationModal.tsx      # Modal principal de cotización
│   ├── QuotationSuccess.tsx    # Página de confirmación
│   ├── Notification.tsx        # Sistema de notificaciones
│   └── ui/                     # Componentes base UI
├── stores/
│   └── quotationStore.ts       # Store de Zustand para cotizaciones
├── services/
│   └── emailService.ts         # Servicio modular de email
├── hooks/
│   └── useEmailNotifications.ts # Hook para notificaciones
├── interfaces/
│   └── quotation.ts            # Tipos TypeScript
└── pages/
    ├── QuotationPage.tsx       # Página de cotización
    └── products/
        └── Detail.tsx          # Página de detalle (actualizada)
```

## 🔧 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Configuración de Email

El sistema soporta múltiples proveedores de email:

#### Desarrollo (Mock)
```env
VITE_EMAIL_PROVIDER=mock
VITE_EMAIL_FROM=noreply@tuempresa.com
VITE_EMAIL_FROM_NAME="Tu Empresa S.L."
```

#### Producción (SendGrid)
```env
VITE_EMAIL_PROVIDER=sendgrid
VITE_EMAIL_API_KEY=SG.tu_api_key
VITE_EMAIL_FROM=noreply@tudominio.com
VITE_EMAIL_FROM_NAME="Tu Empresa S.L."
```

Ver `EMAIL_SETUP.md` para configuración detallada.

## 🎯 Flujo de Usuario

1. **Navegación de productos**: El usuario navega por el catálogo
2. **Selección de productos**: Añade productos a cotizar desde la página de detalle
3. **Formulario de cotización**: Completa sus datos (nombre, email, teléfono)
4. **Envío automático**: Se crea la cotización y se envía email de confirmación
5. **Página de confirmación**: Ve el resumen y puede descargar PDF
6. **Seguimiento**: Recibe email con detalles y próximos pasos

## 🛠️ Tecnologías Utilizadas

- **React** + **TypeScript** - Frontend framework
- **Zustand** - Estado global con persistencia
- **React Router** - Navegación SPA
- **shadcn/ui** - Sistema de componentes
- **Tailwind CSS** - Estilos utility-first
- **jsPDF** - Generación de PDFs
- **Vite** - Build tool y dev server

## 📧 Sistema de Email

### Proveedores Soportados
- ✅ **Mock** (desarrollo)
- ⚡ **SendGrid** (listo para usar)
- ⚡ **Resend** (listo para usar)
- ⚡ **EmailJS** (cliente)
- ⚡ **Nodemailer** (SMTP)

### Características del Email
- **HTML responsivo** con CSS inline
- **Versión texto plano** incluida
- **Logo y branding** personalizable
- **Información completa** de la cotización
- **Próximos pasos** claros para el cliente

## 🎨 Personalización

### Templates de Email
Edita `src/services/emailService.ts` en la función `generateQuotationEmailTemplate()`:

```typescript
// Personalizar colores, logo, contenido, etc.
const htmlContent = `
  <h1 style="color: #tu-color;">${tu-empresa}</h1>
  // ... resto del template
`;
```

### Estilos y Branding
- Modifica `src/components/ui/` para componentes base
- Actualiza colores en `tailwind.config.js`
- Cambia logos y assets en `public/`

### Información de Empresa
Actualiza los datos de contacto en:
- `src/services/emailService.ts` (templates)
- `src/components/QuotationSuccess.tsx` (página de confirmación)
- `src/pages/products/Detail.tsx` (información de contacto)

## 🔐 Consideraciones de Seguridad

- **Variables de entorno**: Nunca commitear `.env.local`
- **Validación**: Validación en frontend (añadir backend para producción)
- **Rate limiting**: Implementar en backend para evitar spam
- **Sanitización**: Los datos se escapan automáticamente en React

## 🚦 Estados y Flujos

### Estados de Cotización
- `pending` - Recién creada, pendiente de revisión
- `sent` - Email enviado correctamente
- `approved` - Aprobada por el equipo comercial
- `rejected` - Rechazada

### Estados de Email
- ⏳ **Enviando** - Mostrando loader
- ✅ **Éxito** - Email enviado, mostrando ID de mensaje
- ❌ **Error** - Fallo en envío, cotización guardada
- ⚠️ **Advertencia** - Advertencias del servicio

## 📱 Responsive Design

El sistema está optimizado para:
- 📱 **Móviles** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Wide screens** (1280px+)

## 🧪 Testing

### Desarrollo
```bash
# Ejecutar con email mock
VITE_EMAIL_PROVIDER=mock pnpm dev
```

### Producción
```bash
# Probar con proveedor real
VITE_EMAIL_PROVIDER=sendgrid pnpm build && pnpm preview
```

## 🔄 Próximas Mejoras

### Funcionalidades Sugeridas
- [ ] Dashboard de administración para gestionar cotizaciones
- [ ] Integración con CRM (Salesforce, HubSpot)
- [ ] Notificaciones push en tiempo real
- [ ] Chat en vivo para soporte
- [ ] Sistema de aprobación workflow
- [ ] Analytics y métricas de conversión
- [ ] API REST para integraciones
- [ ] Autenticación y cuentas de usuario
- [ ] Historial de cotizaciones por cliente
- [ ] Plantillas de cotización personalizables

### Optimizaciones Técnicas
- [ ] Server-side rendering (SSR)
- [ ] Optimización de imágenes automática
- [ ] Lazy loading de componentes
- [ ] Service Worker para offline
- [ ] Compresión de assets
- [ ] CDN para recursos estáticos

## 🆘 Troubleshooting

### Email no se envía
1. Verifica variables de entorno
2. Revisa consola del navegador
3. Comprueba configuración del proveedor
4. Verifica dominio verificado

### PDF no se genera
1. Verifica que jsPDF esté instalado
2. Revisa permisos del navegador
3. Comprueba datos de la cotización

### Estilos rotos
1. Verifica que Tailwind esté configurado
2. Revisa imports de CSS
3. Comprueba conflictos de clases

## 📞 Soporte

Para problemas técnicos:
1. Revisa la consola del navegador
2. Verifica la configuración de variables de entorno
3. Consulta los logs del servicio de email
4. Verifica la documentación del proveedor de email

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

**¡El sistema está listo para producción!** 🎉

Solo necesitas:
1. Configurar un proveedor de email real
2. Personalizar la información de tu empresa
3. Ajustar estilos según tu branding
4. Desplegar en tu plataforma preferida
