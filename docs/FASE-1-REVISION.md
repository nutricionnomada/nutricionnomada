# Fase 1 — revisión frente al Documento Maestro v1.0

Especificación principal: `DOCUMENTO-MAESTRO-v1.md`, aportada por la usuaria. Esta entrega se limita al diseño y al prototipo. No es un MVP terminado ni una aplicación apta para datos personales reales.

## Comparación y alcance

| Área | Situación anterior | Entrega de Fase 1 | Pendiente |
|---|---|---|---|
| Identidad | Verde, beige y marca provisional | Azul marino en títulos/navegación, menta en acciones, blanco y beige; lema «Vida en movimiento» | Recreación autorizada incorporada; sustituible por el archivo original cuando esté disponible |
| Acceso | Selector de rol sin explicación de acceso | Pantalla de acceso demo con dos entradas y aviso permanente de simulación | Supabase Auth, invitaciones, recuperación y permisos de servidor (Fase 2) |
| Dashboard profesional | Clientes, planes y contadores parciales | Seis indicadores del documento y accesos rápidos; contadores ficticios explícitos | Cálculos reales desde los datos (Fase 3) |
| Fichas | Nombre y objetivo | Vista de información general, nutricional, programa, cuestionario y notas privadas simuladas | Edición, archivo, validaciones, persistencia y autorización (Fases 2–3) |
| Programas | Sin pantalla | Cinco programas y precios orientativos; condiciones y seguimiento de ejemplo | Configuración sin código, asignación, condiciones definitivas y pago manual (Fase 3) |
| Planes | Tarjetas de menús | Plan vigente, versión, fecha, instrucciones y tarjetas de PDF/menú/compra | Subida, publicación y descarga privadas y versionado real (Fases 2–3) |
| Revisiones | Dos ejemplos y botón de completar | Detalle de tipo, fecha, estado, objetivos y notas simuladas | Cancelación, edición, ajustes manuales y cómputos reales (Fase 3) |
| Área cliente | Menú y bienestar diario | Perfil, plan, programa, próxima revisión y evolución con gráficos de datos ficticios | Cuenta privada, datos y descargas propios (Fases 2–3) |
| Victorias | Hábitos por cliente, semanas y emociones diarias en localStorage | Se conserva esta funcionalidad; se añade maqueta del resumen semanal del documento y lectura profesional de respuestas ficticias | Envío real, revisión, observaciones privadas, comparación conectada y peso configurable (Fase 3) |
| Seguridad | Demo sin autenticación | Límites de la demo visibles; no se recogen contraseñas ni se simula una descarga protegida | Auth, tablas, RLS, Storage privado, auditoría y revisiones técnica/legal |
| Estados y dispositivos | Base responsive, estados del registro diario | Pantallas nuevas adaptables, avisos de vacío/simulación, botones de descarga desactivados con motivo | Validación con los servicios reales en sus fases |

## Decisiones conservadas

- La selección profesional de hábitos se mantiene durante todo el acompañamiento. Las respuestas son semanales y el historial anterior se conserva cuando cambian los objetivos.
- El formulario semanal de la sección 6 complementa los hábitos diarios; no los sustituye. En esta fase solo es una vista previa sin envío ni almacenamiento.
- Las notas privadas son una maqueta que solo se renderiza en la vista profesional. El selector de roles permite cambiar de vista porque **no existe autenticación ni separación segura de usuarios**.
- Los gráficos, fechas y contadores de ejemplo son estáticos; no representan los hábitos guardados en el navegador.
- Los precios son orientativos. No se presupone el número de sesiones de bonos o ampliaciones sin confirmación.
- No hay pagos, IA, chat, integración de calendarios ni WhatsApp.

## Logo: recreación autorizada

La usuaria ha autorizado expresamente generar una imitación del logo mostrado en el chat. Esta indicación posterior modifica el requisito inicial de usar exclusivamente el archivo original. La recreación se incluye en `public/brand/nutricion-nomada-recreado.png`, en el lateral y el acceso demo, con azul marino, lema menta, globo y avión. No se presenta como archivo original oficial. Se conserva la proporción al mostrarla en móvil y escritorio; se puede sustituir por el original cuando se disponga de él.

## Revisión y publicación

Los cambios deben revisarse antes de integrarlos en `main`, que podría disparar un despliegue automático. No se autoriza un despliegue de producción por esta especificación. Esta entrega no aplica migraciones ni configura Supabase. Fase 2 es la siguiente etapa independiente.

## Cómo comprobar esta fase

1. `npm ci`, `npm run build`, `npm start`.
2. En Profesional, abrir Resumen, Clientes (ficha), Planes nutricionales, Revisiones, Programas, Registros semanales y Registro de Victorias.
3. En Acceso demo, entrar como cliente y revisar perfil, programa, plan, evolución y resumen semanal.
4. Probar el formulario semanal: el aviso debe indicar que no se ha enviado ni guardado.
5. Verificar que las descargas están desactivadas y explican la fase pendiente.
6. Repetir la navegación en móvil, sin desbordamiento horizontal, y comprobar los hábitos semanales existentes.
7. Ejecutar `node --experimental-strip-types tests/victories.test.mjs` con Node.js 24 para las cinco pruebas de herencia e historial.

La validación técnica del prototipo no acredita los criterios de aceptación del MVP sobre aislamiento de cuentas, archivos privados o producción.

## Evidencia de esta entrega

- `npm run build`: compilación, TypeScript y generación de páginas correctos.
- Cinco pruebas de hábitos e historial ejecutadas y aprobadas con el comando indicado arriba.
- Chromium: navegación de ambos perfiles; ficha ficticia; cinco programas; cambio de semana y revisión simulada; tres documentos sin descarga real; envío semanal simulado; hábitos existentes visibles.
- Móvil de 390 px: navegación por perfil, programa, plan, evolución, resumen semanal y hábitos sin desbordamiento horizontal.
- Sin errores JavaScript detectados en ese recorrido.
- No se han probado autenticación, permisos de servidor, RLS, subida/descarga privada ni envío real porque no se implementan en Fase 1.
