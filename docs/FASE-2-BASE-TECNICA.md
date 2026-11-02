# Fase 2 — base de datos y autenticación

Esta entrega desarrolla la Fase 2 del Documento Maestro. Conserva el prototipo, el logo recreado autorizado y los hábitos del acompañamiento. No conecta los formularios de Fase 1 con datos reales (eso corresponde a Fase 3).

## Implementado en el repositorio

- Integración oficial `@supabase/ssr` y `@supabase/supabase-js` con cookies de sesión del servidor, HTTP-only, SameSite Lax y Secure en producción.
- `/acceso`, `/recuperar`, `/actualizar-contrasena`: validación de entradas, estados de espera/error y mensajes de recuperación que no revelan si existe una cuenta.
- `/auth/callback`: intercambio PKCE y retorno restringido a rutas internas predefinidas.
- `/auth/confirm`: verificación de tokens de un solo uso para invitación/recuperación. No permite elegir libremente un destino externo.
- `/area`, `/area/profesional` y `/area/cliente`: usuario verificado mediante `getUser()` en el servidor y rol consultado en `profiles`. El selector público de la demo no determina permisos.
- Actualización de sesiones mediante `proxy.ts`; las páginas privadas vuelven a comprobar la identidad. No se confía solo en el proxy, en cookies sin validar ni en `user_metadata`.
- Sin Supabase, formularios desactivados, aviso explícito y rutas privadas redirigidas al acceso. No se inventan usuarios ni contraseñas y la demo pública sigue funcionando.
- Migración versionada `supabase/migrations/202611020001_phase2.sql` con relaciones, índices, restricciones, RLS, bitácora administrativa y un bucket privado de PDF.
- `.env.example` sin valores; no se utiliza ni se requiere una clave `service_role` en la aplicación.

## Modelo y permisos

| Tabla | Lectura cliente | Escritura cliente | Profesional |
|---|---|---|---|
| profiles | Su propio perfil | Solo su nombre visible | Su perfil y los perfiles vinculados de sus clientes; no puede elevar roles |
| clients | Su ficha vinculada | Ninguna | Sus fichas; crear inicialmente sin cuenta vinculada |
| programs | Los programas asignados a su ficha | Ninguna | Su propio catálogo |
| client_programs | Sus asignaciones | Ninguna | Asignaciones de sus clientes; programa de la misma consulta |
| appointments | Sus revisiones | Ninguna | Revisiones de sus clientes |
| meal_plans | Solo publicados de su ficha | Ninguna | Versiones de sus clientes |
| habit_sets | Sus versiones de hábitos | Ninguna | Selección por cliente y fecha de vigencia |
| checkins | Sus registros | Crear/editar/eliminar borradores propios; enviar una vez | Leer los enviados de sus clientes |
| checkin_reviews | Ninguna (contiene observación privada) | Ninguna | Revisar registros de sus clientes |
| measurements | Sus mediciones | Propias, con límites; peso desactivado por defecto | Mediciones de sus clientes |
| professional_notes | Ninguna | Ninguna | Solo las notas de sus clientes |
| audit_events | Ninguna | Ninguna | Consultar eventos propios; no modificarlos |

El feedback compartido y la edición posterior de registros enviados necesitarán un flujo explícito en Fase 3. Las notas privadas nunca deben copiarse a una entidad legible por el cliente.

Los registros semanales guardan una instantánea de los hábitos vigentes, elegida por el servidor, e impiden cambiar su cliente o semana. Los cambios de hábitos no reescriben los registros anteriores. La interfaz actual de hábitos sigue usando localStorage: no se migra automáticamente ningún contenido del navegador al servidor.

La bitácora registra recurso, identificadores, actor, operación y fecha; no copia textos de salud, notas ni credenciales. Su conservación y los logs de administración externos deben concretarse antes de producción.

## Activación pendiente (no ejecutada)

No existe proyecto Supabase configurado en este entorno. Los siguientes pasos son instrucciones, no operaciones realizadas:

1. Crear un proyecto de **desarrollo**, preferiblemente en la UE. Mantener desactivado el registro público, configurar políticas de contraseña de al menos 12 caracteres, rate limits y protección contra abuso del servicio Auth.
2. Aplicar la migración mediante Supabase CLI (`supabase db push` sobre el proyecto de desarrollo correctamente enlazado) o su editor SQL. No ejecutar sobre una base con tablas de igual nombre sin revisar previamente la migración.
3. Permitir el hostname exacto del proyecto (`<referencia>.supabase.co`) en la política de red del entorno de desarrollo, si está restringida. Copiar `.env.example` a `.env.local` e introducir URL y clave **pública** de Supabase y el origen de la aplicación. Puede usarse `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` o la antigua `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Las variables públicas no sustituyen a RLS. No introducir `service_role` ni credenciales de base de datos en el navegador.
4. Configurar Site URL y allowlist de redirecciones de Auth con el origen exacto de desarrollo. Usar HTTPS salvo localhost en desarrollo. Registrar las rutas `/auth/callback` y `/auth/confirm` con los parámetros previstos, sin comodines amplios de dominios.
5. Para enlaces de invitación y recuperación, configurar las plantillas de email de Supabase con `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite` y `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`, respectivamente. Un email real requiere SMTP configurado y una acción administrativa autorizada; esta entrega **no envía invitaciones ni correos**.
6. Crear únicamente cuentas ficticias de prueba desde la administración de Auth. Todas nacen con rol `client`, independientemente de sus metadatos. Un administrador verificado debe promover explícitamente la cuenta profesional desde SQL administrativo. No existe registro público ni selector de rol para este paso.
7. Desde SQL administrativo, vincular cada cuenta cliente a una única ficha (`clients.profile_id`). La vinculación o transferencia está bloqueada para usuarios ordinarios de la API; evita que un profesional enlace arbitrariamente una cuenta ajena.
8. Probar inicio y cierre de sesión, renovación, recuperación, invitación y expiración de enlaces con el servicio real. Comprobar mediante API real que dos clientes y dos profesionales no pueden acceder a datos ajenos, y que Storage rechaza documentos no publicados.

Ejemplo de operación administrativa, **solo después de verificar los UUID ficticios en el proyecto de desarrollo**:

```sql
-- Plantilla: sustituir por UUID obtenidos de Auth, nunca por roles enviados desde el navegador.
-- UPDATE public.profiles SET role = 'professional' WHERE id = '<UUID profesional verificado>';
-- UPDATE public.clients SET profile_id = '<UUID cliente verificado>' WHERE id = '<UUID ficha verificada>';
```

No se ha creado ningún proyecto, cuenta, contraseña o secreto; no se han aplicado migraciones remotas ni desplegado en producción.

## PDF privados

La migración crea el bucket `nutrition-plans`, privado, máximo 10 MiB y MIME PDF. Los objetos requieren una fila `meal_plans` y la ruta canónica `professional_id/client_id/meal_plan_id.pdf`. El cliente solo puede leer objetos publicados de su ficha; solo su profesional puede subir/eliminar objetos registrados. No hay política de actualización del objeto: una nueva versión debe usar una nueva fila/archivo.

La Fase 3 debe validar contenido y tamaño en el servidor, limpiar cargas fallidas y emitir descargas/autorizaciones de corta duración. No basta con confiar en la extensión ni en el MIME enviado por el navegador. El acceso a PDFs reales no está habilitado en la interfaz.

## Comprobaciones y límites

- `npm run test:database`: ejecuta la migración completa en PostgreSQL embebido (PGlite) y pruebas con roles anon/authenticated y UUID ficticios. Los esquemas Auth y Storage se simulan **solo en estas pruebas**; esto no valida el servicio Auth, los emails ni la API de Storage alojados.
- `npm run test:auth`: validaciones, roles desconocidos y destinos de retorno cerrados.
- `npm run test:habits`: regresión del historial de hábitos de la demo.
- `npm run typecheck` y `npm run build`: compilación sin claves ni servicios externos.
- Comprobación de navegador: pantallas de acceso desactivadas sin configuración, redirección de rutas privadas y rechazo de callbacks inválidos, sin romper la demo.

Las pruebas usan Node.js 24. No presentar la autenticación como operativa ni la Fase 2 como validada de extremo a extremo hasta ejecutar los pasos pendientes con Supabase de desarrollo. La integración funcional de fichas, PDFs, programas, revisiones, checkins y evolución continúa siendo Fase 3.

Antes de datos reales siguen pendientes revisión de permisos sobre el servicio desplegado, copias/restauración, exportación/borrado, observabilidad, límites de abuso, configuración de correo y revisión técnica y legal/RGPD. Mantener cambios en una rama de revisión, sin integrar ni desplegar producción automáticamente.

## Evidencia de esta entrega

- Compilación de producción y TypeScript: correctos, sin variables Supabase.
- 12 pruebas de SQL/RLS en PostgreSQL embebido: aprobadas.
- 3 pruebas de validación/autorización de retorno: aprobadas.
- 5 pruebas de regresión de hábitos: aprobadas.
- Chromium: formularios editables desactivados al faltar configuración; las tres rutas privadas terminan en acceso; una cookie de rol falsificada no concede acceso; callbacks de código/token inválidos vuelven al acceso sin seguir destinos externos; enlace desde la demo y logo cargados.
- Móvil de 390 px: acceso sin desbordamiento horizontal y sin errores JavaScript en el recorrido.
- No ejecutado: autenticación con Supabase alojado, envío de correo, invitación real, renovación de una sesión real y Storage por HTTP. No se han aplicado las migraciones a ningún servicio remoto.
