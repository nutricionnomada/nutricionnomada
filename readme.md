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

Todos los perfiles y registros son ficticios. El Registro de Victorias se guarda en el almacenamiento local de este navegador; el resto del estado se conserva en memoria y se reinicia al recargar. No introduzcas información personal real.

Esta estructura inicial no incluye autenticación, base de datos, agenda real ni envío de notificaciones. Los dos paneles comparten la misma demostración; los menús son ejemplos de interfaz y no planes personalizados.

## Estructura

- `app/layout.tsx`: idioma, metadatos y estilos globales.
- `app/page.tsx`: paneles, navegación y estado de la demostración.
- `app/globals.css`: Tailwind y diseño adaptable.

## Registro de Victorias

En ambos paneles, abre **Registro de Victorias** en la navegación.

- Profesional: selecciona un cliente ficticio y la semana. Selecciona una vez los hábitos del acompañamiento, de las siete categorías del catálogo o con texto personalizado y un objetivo acordado. Se repiten automáticamente cada semana. Puedes adaptarlos cuando cambie el objetivo y escribir un comentario semanal.
- Las semanas nuevas heredan los hábitos del acompañamiento; las marcas, emociones y comentarios son independientes. No hace falta copiar ni volver a seleccionar hábitos.
- Edita los hábitos desde **Semana actual**: se aplican a esa semana y las siguientes, conservando las semanas anteriores. Editar el texto o el objetivo conserva las marcas del hábito; quitarlo elimina sus marcas solo desde la semana actual.
- Los registros existentes de la versión anterior se migran automáticamente, conservando sus respuestas y usando la selección más reciente del cliente como base del acompañamiento.
- Cliente: el selector de perfil permite simular cualquiera de los clientes ficticios. Marca los hábitos de lunes a domingo y registra energía, hambre, ánimo y descanso (1–5), victoria y dificultad del día. En móvil aparece una vista por día.
- Profesional: consulta las marcas y el registro emocional sin modificar las respuestas del cliente.
- Usa las flechas o la fecha para consultar otras semanas. Cualquier fecha seleccionada se ajusta al lunes correspondiente.

Los registros se guardan automáticamente con `localStorage`, separados por cliente y semana. Se comparten entre ambos paneles **solo en el mismo navegador y origen**. No son cuentas independientes ni sincronización en servidor. Si el almacenamiento está bloqueado, se muestra un aviso y los cambios solo permanecen en memoria. Borrar los datos del sitio elimina los registros. Los perfiles nuevos añadidos al resto de la demo siguen siendo temporales.

El catálogo reproduce los hábitos proporcionados por Nutrición Nómada; la selección y los objetivos son responsabilidad del profesional. No se calculan penalizaciones ni una puntuación de éxito a partir del hambre o de las casillas vacías.

## Documento Maestro y desarrollo por fases

La especificación principal está en [docs/DOCUMENTO-MAESTRO-v1.md](docs/DOCUMENTO-MAESTRO-v1.md). La comparación, alcance de Fase 1, limitaciones y recorrido de revisión están en [docs/FASE-1-REVISION.md](docs/FASE-1-REVISION.md).

Esta entrega amplía **solo el diseño y prototipo**: acceso demo, programas, detalles de ficha/revisión, plan vigente, perfil, evolución visual y resumen semanal. No hay autenticación, conexión a Supabase ni descarga de documentos. Las notas y los envíos nuevos son simulaciones; los hábitos existentes mantienen su guardado local. El selector de roles no constituye una barrera de seguridad.

La usuaria ha autorizado una recreación del logo mostrado en el chat. Está en `public/brand/nutricion-nomada-recreado.png` y se usa en el lateral y el acceso demo mediante `app/components/brand.tsx`. Es una imitación, no el archivo original oficial.
