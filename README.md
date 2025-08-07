# Dym Frontend - E-commerce Application

Frontend moderno para aplicación de e-commerce construido con React, TypeScript, Vite y Strapi como backend.

## 🚀 Tecnologías

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y desarrollo
- **Tailwind CSS** - Styling
- **Radix UI** - Componentes accesibles
- **React Router** - Routing
- **Strapi** - Backend CMS

## 📋 Prerequisitos

- Node.js (v18 o superior)
- pnpm (recomendado) o npm
- Backend de Strapi funcionando

## ⚙️ Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd dym-fe
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=tu_strapi_token_aqui
```

### 4. Iniciar desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Scripts Disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm preview` - Previsualiza la build de producción
- `pnpm lint` - Ejecuta ESLint

## 🚀 Deployment

### Vercel (Recomendado)

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en Vercel Dashboard:
   - `VITE_STRAPI_URL`: URL de tu backend de Strapi en producción
   - `VITE_STRAPI_TOKEN`: Token de API de Strapi

Para más detalles, consulta [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Estructura del Proyecto

```
src/
├── api/          # Configuración y llamadas a la API
├── components/   # Componentes reutilizables
├── contexts/     # Contextos de React
├── hooks/        # Hooks personalizados
├── interfaces/   # Definiciones de tipos TypeScript
├── lib/          # Utilidades
├── pages/        # Páginas/vistas de la aplicación
└── services/     # Servicios externos
```

## 🔧 Características

- ✅ Catálogo de productos con filtros
- ✅ Detalles de productos
- ✅ Diseño responsive
- ✅ Tema claro/oscuro
- ✅ Lazy loading de imágenes
- ✅ Manejo centralizado de APIs
- ✅ Manejo de errores

## 🐛 Solución de Problemas

### Error "net::ERR_BLOCKED_BY_CLIENT"

Este error suele estar causado por:
1. Ad blockers o extensiones del navegador
2. URLs de API incorrectas
3. Variables de entorno no configuradas

**Solución:**
1. Verifica que las variables de entorno estén configuradas correctamente
2. Deshabilita temporalmente ad blockers
3. Verifica que el backend de Strapi esté funcionando

### Error de CORS

Configura tu backend de Strapi para permitir requests desde tu dominio frontend:

```js
// strapi/config/middlewares.js
'strapi::cors': {
  enabled: true,
  origin: ['http://localhost:5173', 'https://tu-dominio-vercel.vercel.app']
}
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
