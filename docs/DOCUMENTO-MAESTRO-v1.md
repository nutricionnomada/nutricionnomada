# DOCUMENTO MAESTRO — NUTRICIÓN NÓMADA APP
**Versión 1.0 | Especificaciones para Codex**

## 1. Objetivo del proyecto

Crear una aplicación web profesional, responsive y en español para **Nutrición Nómada**, una consulta de asesoramiento nutricional online cuyo lema es «Vida en movimiento».

La aplicación debe centralizar la gestión de clientes, los planes nutricionales personalizados, los registros semanales, la evolución y las revisiones.

Debe tener dos áreas conectadas:

- **Panel profesional:** para administrar clientes y realizar el seguimiento nutricional.
- **Panel del cliente:** para consultar sus planes, registrar sus hábitos y visualizar su evolución.

El objetivo es automatizar tareas administrativas y mejorar la experiencia del cliente, manteniendo un servicio personalizado y cercano.

La aplicación debe ser sencilla de utilizar para personas sin conocimientos tecnológicos.

## 2. Identidad visual

Utilizar el logo oficial ya incorporado al proyecto.

**Colores de marca:**
- Azul marino: color principal de títulos y navegación.
- Verde menta: acciones principales, indicadores y elementos destacados.
- Blanco: fondos principales.
- Beige claro: fondos secundarios y tarjetas.

Estilo minimalista, elegante, limpio, moderno y profesional.

Requisitos:
- Logo original sin alteraciones.
- Diseño adaptado a ordenador, tablet y móvil.
- Tipografía legible y tamaños accesibles.
- Navegación intuitiva.
- Tarjetas con bordes suaves.
- Gráficos claros y fáciles de interpretar.
- Todos los textos en español.
- Estados de carga, error y ausencia de datos.

## 3. Perfiles de usuario

### 3.1. Profesional administrador

Acceso privado para gestionar todos los clientes asignados a la consulta.

Funciones:
- Crear, editar y archivar fichas de clientes.
- Consultar cuestionarios iniciales.
- Asignar programas nutricionales.
- Subir y actualizar planes.
- Gestionar revisiones.
- Consultar registros semanales.
- Visualizar gráficas de evolución.
- Registrar observaciones profesionales privadas.
- Controlar sesiones realizadas y pendientes.
- Consultar programas próximos a finalizar.

### 3.2. Cliente

Cada cliente tendrá una cuenta individual.

Podrá:
- Consultar su perfil.
- Ver su plan nutricional vigente.
- Descargar menús y listas de compra.
- Completar su Registro de victorias.
- Registrar su peso de manera opcional.
- Consultar su evolución.
- Ver su próxima revisión.
- Consultar su programa y sesiones pendientes.

Un cliente nunca podrá consultar información de otros clientes ni las notas privadas del profesional.

## 4. Panel profesional

### 4.1. Dashboard principal

La pantalla inicial mostrará:

- Número de clientes activos.
- Revisiones próximas.
- Registros semanales recibidos.
- Registros pendientes.
- Programas próximos a finalizar.
- Sesiones pendientes.

Incluir accesos rápidos para crear un cliente, subir un plan y revisar los registros recibidos.

### 4.2. Gestión de clientes

Cada ficha contendrá:

**Información general**
- Nombre y apellidos.
- Correo electrónico.
- Teléfono, si es necesario.
- Fecha de incorporación.
- Estado del cliente: activo, pausado o finalizado.

**Información nutricional**
- Objetivo principal.
- Cuestionario inicial.
- Preferencias alimentarias.
- Alimentos que evita.
- Alergias e intolerancias relevantes.
- Observaciones profesionales.
- Mediciones voluntarias.

**Programa contratado**
- Nombre del programa.
- Fecha de inicio.
- Fecha prevista de finalización.
- Número de revisiones incluidas.
- Revisiones realizadas.
- Revisiones pendientes.
- Estado del programa.

La información de salud debe almacenarse únicamente cuando sea necesaria para la prestación del servicio y con las medidas de protección correspondientes.

### 4.3. Planes nutricionales

Permitir:
- Subir archivos PDF.
- Asignar un plan a un cliente.
- Identificar el plan vigente.
- Guardar versiones anteriores.
- Adjuntar menús y listas de compra.
- Indicar la fecha de actualización.
- Añadir instrucciones personalizadas.

El cliente solo verá los documentos que el profesional haya publicado expresamente.

### 4.4. Revisiones

Cada revisión tendrá:
- Cliente.
- Fecha y hora.
- Tipo: inicial, quincenal, mensual o extraordinaria.
- Estado: pendiente, realizada o cancelada.
- Notas privadas.
- Próximos objetivos acordados.

El sistema calculará las revisiones pendientes según el programa contratado, permitiendo ajustes manuales.

## 5. Panel del cliente

### 5.1. Pantalla de inicio

Mostrar un saludo personalizado y un resumen de su seguimiento.

Elementos:
- Próxima revisión.
- Plan nutricional vigente.
- Registro semanal pendiente o completado.
- Objetivos acordados.
- Últimos progresos registrados.

Evitar mensajes que generen culpa o presión por el peso.

### 5.2. Mi plan nutricional

El cliente podrá:
- Consultar su plan vigente.
- Descargar su menú.
- Descargar su lista de compra.
- Consultar indicaciones adicionales.
- Ver cuándo se actualizó el plan.

### 5.3. Mi evolución

Mostrar gráficos históricos de los indicadores que el profesional haya habilitado.

La evolución no debe centrarse exclusivamente en el peso.

Incluir hábitos, adherencia, bienestar y logros personales.

## 6. Registro de victorias

Esta es una funcionalidad central de la metodología Nutrición Nómada.

El cliente completará un formulario semanal con los siguientes apartados:

**1. Mis victorias de la semana**

¿Qué has conseguido esta semana de lo que te sientes orgulloso/a?

Campo de texto libre.

**2. Alimentación**

¿Cómo te has organizado con tus comidas?

Opciones orientativas:
- Muy bien.
- Bastante bien.
- He tenido algunas dificultades.
- Necesito ayuda.

**3. Actividad física**

¿Cómo ha sido tu actividad física esta semana?

Campo de texto y opción de registrar frecuencia.

**4. Descanso**

¿Cómo has descansado?

Escala sencilla del 1 al 5.

**5. Bienestar**

¿Cómo te has sentido física y emocionalmente?

Escala del 1 al 5 y comentario opcional.

**6. Dificultades**

¿Qué te ha resultado más complicado?

Campo de texto libre.

**7. Objetivo de la próxima semana**

¿Qué pequeño hábito quieres trabajar?

Campo de texto libre.

**8. Peso**

Campo opcional, desactivable por el profesional.

### Vista profesional del registro

Cuando un cliente envíe su registro, el profesional podrá:
- Leer las respuestas.
- Comparar semanas.
- Marcar el registro como revisado.
- Escribir una observación privada.
- Preparar ajustes para la próxima sesión.

El registro debe conservar la fecha y permitir consultar el historial.

## 7. Programas y servicios

La aplicación debe permitir crear y modificar programas sin cambiar el código.

Configuración inicial orientativa:

| Programa | Precio de referencia |
|---|---:|
| Programa con sesión inicial y 3 revisiones quincenales | 160 € |
| Programa con sesión inicial y 3 revisiones mensuales | 120 € |
| Sesión mensual | 40 € |
| Bono de 2 meses | 180 € |
| Ampliación de 6 meses | 420 € |

Los precios y condiciones deben ser editables.

No implementar pagos online en la primera versión.

El administrador podrá marcar manualmente un pago como pendiente o recibido, sin almacenar datos bancarios.

## 8. Flujo de trabajo

El funcionamiento de la consulta será:

1. El cliente completa un formulario inicial.
2. El profesional revisa la información.
3. Se confirma el programa y el pago por los canales actuales.
4. El profesional prepara el plan personalizado.
5. Se realiza una sesión inicial de aproximadamente 20 minutos.
6. El profesional publica el plan en la aplicación.
7. El cliente accede a su área privada.
8. Cada semana completa el Registro de victorias.
9. El profesional revisa los registros y realiza las sesiones correspondientes.
10. Al finalizar el programa, se puede ofrecer una renovación.

En el MVP, el formulario inicial podrá introducirse manualmente desde el panel profesional. La integración con formularios externos se realizará en una fase posterior.

## 9. Arquitectura técnica

Tecnologías propuestas:

- Next.js con TypeScript.
- Tailwind CSS.
- Supabase Auth para autenticación.
- PostgreSQL de Supabase para los datos.
- Supabase Storage privado para documentos.
- Vercel para despliegue.
- GitHub para control de versiones.

Organizar el código en componentes reutilizables.

Separar la lógica de negocio, la interfaz, las validaciones y el acceso a los datos.

Crear migraciones de base de datos versionadas.

### Entidades principales

- profiles
- clients
- programs
- client_programs
- appointments
- meal_plans
- checkins
- measurements
- professional_notes

Definir relaciones, claves, restricciones e índices apropiados.

## 10. Seguridad y protección de datos

La aplicación tratará información personal y potencialmente datos de salud, por lo que la seguridad es prioritaria.

Requisitos:
- Autenticación segura.
- Roles y permisos verificados en el servidor.
- Row Level Security en todas las tablas relevantes.
- Archivos privados y acceso controlado.
- No exponer claves secretas en el navegador.
- No incluir datos personales en el repositorio.
- No utilizar datos reales durante el desarrollo.
- Validar entradas y archivos.
- Proteger los procesos de invitación y recuperación de contraseñas.
- Registrar los cambios administrativos relevantes.
- Establecer procedimientos de copia de seguridad y recuperación.
- Facilitar exportación y eliminación de datos conforme a los requisitos aplicables.

Antes de incorporar clientes reales, preparar una revisión de cumplimiento del RGPD, incluyendo información de privacidad, bases jurídicas, contratos con encargados del tratamiento, conservación de datos, posibles transferencias internacionales y evaluación de riesgos.

No considerar el proyecto apto para producción hasta completar la revisión técnica, de seguridad y legal.

## 11. Alcance del MVP

### Incluir en la primera versión

- Identidad visual y logo oficial.
- Inicio de sesión.
- Dos roles: profesional y cliente.
- Dashboard profesional.
- Fichas de clientes.
- Gestión de programas y revisiones.
- Subida y descarga segura de planes PDF.
- Registro de victorias.
- Gráficas básicas de evolución.
- Diseño responsive.
- Datos ficticios de demostración.

### Dejar para futuras versiones

- Generación de menús mediante IA.
- Pagos integrados.
- Chat interno.
- Notificaciones automáticas por WhatsApp.
- Integración con calendarios externos.
- Aplicación nativa para iOS y Android.
- Generación automática de informes PDF.
- Integración con formularios externos.

## 12. Pruebas y criterios de aceptación

Antes de considerar terminado el MVP, comprobar que:

- El profesional puede crear un cliente ficticio.
- El cliente puede iniciar sesión.
- El cliente puede consultar únicamente su información.
- El profesional puede subir y asignar un plan PDF.
- El cliente puede descargar el plan asignado.
- El cliente puede completar su registro semanal.
- El profesional puede consultar ese registro.
- Las mediciones aparecen correctamente en las gráficas.
- Las revisiones se contabilizan correctamente.
- La interfaz funciona en móvil y ordenador.
- Los intentos de acceso no autorizado son rechazados.
- Las operaciones críticas tienen pruebas automatizadas.
- El proyecto puede instalarse, compilarse y ejecutarse sin errores.

## 13. Instrucciones de ejecución para Codex

Desarrolla el proyecto por fases.

**Fase 1 — Diseño y prototipo**

Crear las pantallas principales, la navegación y los componentes visuales utilizando datos ficticios.

**Fase 2 — Base de datos y autenticación**

Crear las tablas, migraciones, autenticación y políticas de acceso.

**Fase 3 — Funcionalidades**

Implementar fichas, planes PDF, programas, revisiones, registros y evolución.

**Fase 4 — Pruebas y correcciones**

Comprobar funcionalidades, permisos, diseño responsive y errores.

**Fase 5 — Preparación para despliegue**

Documentar la configuración, variables de entorno, despliegue y controles pendientes antes de producción.

### Reglas para Codex

- Trabajar sobre el repositorio GitHub existente de Nutrición Nómada.
- Conservar el logo oficial.
- No sobrescribir archivos existentes sin comprobar su contenido.
- No utilizar información de clientes reales.
- Explicar cada fase en español sencillo.
- Mostrar los archivos modificados y las pruebas realizadas.
- No afirmar que una función está terminada si no ha sido comprobada.
- Crear commits descriptivos y proponer los cambios para revisión.
- No desplegar en producción sin autorización expresa.
- Priorizar una aplicación sencilla, segura y mantenible.

**Resultado esperado:** una primera versión funcional de Nutrición Nómada App, con dos paneles conectados, preparada para ser probada con usuarios ficticios y evolucionar posteriormente hacia un servicio real.
