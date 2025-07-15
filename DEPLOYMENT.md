# Configuración de Variables de Entorno para Vercel

## Variables requeridas en Vercel:

1. **VITE_STRAPI_URL**: URL del backend de Strapi en producción
   - Ejemplo: https://tu-strapi-backend.herokuapp.com
   - Esta debe ser la URL completa de tu backend de Strapi en producción

2. **VITE_STRAPI_TOKEN**: Token de API de Strapi
   - El mismo token que estás usando en desarrollo
   - Este token debe tener permisos para acceder a los endpoints necesarios

## Configuración en Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a Settings → Environment Variables
3. Agrega las siguientes variables:

```
VITE_STRAPI_URL=https://tu-backend-strapi.com
VITE_STRAPI_TOKEN=tu_token_aqui
```

## Problemas comunes:

1. **net::ERR_BLOCKED_BY_CLIENT**: 
   - Esto suele ser causado por ad blockers o extensiones del navegador
   - Puede ser resuelto configurando correctamente las URLs de producción

2. **URLs hardcodeadas**:
   - Asegúrate de que todas las llamadas a la API usen las variables de entorno
   - No uses `localhost:1337` en el código que va a producción

3. **CORS Issues**:
   - Configura tu backend de Strapi para permitir requests desde el dominio de Vercel
   - Agrega el dominio de Vercel a la configuración de CORS en Strapi

## Verificación:

Después de configurar las variables de entorno, reconstruye el proyecto en Vercel:
1. Ve a Deployments
2. Haz click en "..." en el deployment más reciente
3. Selecciona "Redeploy"
