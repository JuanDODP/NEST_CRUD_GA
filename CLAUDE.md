# Contexto del Proyecto
Este es el repositorio del **Backend del Sistema de Asignaciones**, un servidor de alto rendimiento diseñado para la gestión de áreas, proyectos y usuarios de **INTEGRA ARRENDA**. El sistema garantiza la integridad de datos y la generación de reportes administrativos mediante una arquitectura sólida y escalable.

# Stack Tecnológico
- **Framework:** NestJS 11 (Modular Architecture).
- **ORM:** TypeORM con soporte nativo para **SQL Server (MSSQL)**.
- **Validación:** DTOs con `class-validator` y transformación automática con `class-transformer`.
- **Reportes:** Generación de documentos PDF profesionales con `pdfmake`.
- **Seguridad:** Encriptación de credenciales con `bcrypt` (10 rounds).

# 🧠 Skills e Inteligencia del Agente (Instaladas en .claude/skills)
El agente **DEBE** consultar estas referencias locales y utilizar la skill de documentación antes de generar código:
- **npx skills add https://github.com/github/awesome-copilot --skill documentation-writer**.
- **nest-typeorm:** Configuración de entidades, repositorios y relaciones en SQL Server.
- **nest-file-system:** Manejo de archivos estáticos y limpieza física de assets.
- **nest-pdf-generator:** Lógica de streams y buffers para reportes con `pdfmake`.

# Directivas de Arquitectura y Código
- **Base de Datos (SQL Server):** - Prohibido el uso de drivers de PostgreSQL (`pg`) detectados en ramas previas.
  - Tipado monetario estricto: `@Column('decimal', { precision: 18, scale: 2, default: 0.00 })`.
- **Manejo de Archivos:** - Rutas absolutas: Usar `path.join(process.cwd(), 'static', ...)` para evitar errores de ruta en macOS.
  - Limpieza Física: Al actualizar o eliminar entidades, borrar el archivo anterior mediante `fs.unlinkSync` (excepto `default-user.png`).
- **Reportes PDF:** - Importación compatible: Usar `const PdfPrinter = require('pdfmake/src/printer')` para evitar fallos de constructor.
  - Multimedia: Convertir imágenes a **Base64** antes de incluirlas para evitar errores de formato desconocido.

# Reglas de Validación (DTOs)
- **Transformación:** Uso mandatorio de `@Type(() => Number)` para campos numéricos/decimales que provienen de peticiones `FormData`.
- **Sueldos:** Validación mediante `@IsNumber({ maxDecimalPlaces: 2 })` y `@Min(0)`.
- **Fechas:** Asegurar integridad lógica en DTOs de proyectos para que `fechaInicio` sea menor a `fechaFin`.

# Manejo de Excepciones y Respuestas
- **DB Errors:** Capturar códigos específicos de SQL Server en `handleDBErrors`:
  - **2627 / 2601:** Violación de restricción única (Unique Constraint).
  - **547:** Conflicto de relación/llave foránea.
- **Respuestas API:** Las URLs de imágenes no se guardan en la DB; se construyen dinámicamente con `configService.get('HOST_API')` para mantener la portabilidad.