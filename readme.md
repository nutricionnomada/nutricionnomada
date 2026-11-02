# Nutrición Nómada App

Aplicación web en español con Next.js (App Router), React, TypeScript y Tailwind CSS. Diseño adaptable en verde menta, beige y blanco.

## Desarrollo

Requiere Node.js 20.9 o superior y npm. Se ha validado con Node.js 24.

```sh
npm ci
npm run dev
```

Abre `http://localhost:3000` en tu equipo. En un entorno remoto, utiliza el acceso al puerto 3000 que proporcione tu plataforma.

## Verificación y producción

```sh
npm run typecheck
npm run build
npm start
```

## Probar la demostración

- Cambia entre **Profesional** y **Cliente** en el menú lateral; en móvil, ábrelo con el botón de navegación.
- En **Clientes**, busca por nombre, abre una ficha o añade un cliente con un nombre inventado.
- En **Planes nutricionales**, consulta el menú de ejemplo que también aparece en el panel cliente.
- En **Revisiones**, marca la revisión de Clara como completada y comprueba el contador del resumen.
- En el panel cliente, registra o desmarca comidas, añade vasos de agua y guarda tu registro de bienestar.

Todos los perfiles y registros son ficticios. El estado se conserva en memoria mientras navegas; al recargar se restaura la demostración. No introduzcas información personal real.

Esta estructura inicial no incluye autenticación, base de datos, agenda real ni envío de notificaciones. Los dos paneles comparten la misma demostración; los menús son ejemplos de interfaz y no planes personalizados.

## Estructura

- `app/layout.tsx`: idioma, metadatos y estilos globales.
- `app/page.tsx`: paneles, navegación y estado de la demostración.
- `app/globals.css`: Tailwind y diseño adaptable.
