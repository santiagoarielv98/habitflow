# 📝 Tareas Pendientes - HabitFlow

## ⏳ Por Implementar

### 1. Filtros en Dashboard ✅ COMPLETADO
- [x] Filtrar hábitos por estado (Todos / Activos / Inactivos)
- [x] Buscar hábitos por nombre y descripción
- [x] Ordenar por diferentes criterios (nombre, fecha creación, frecuencia)
- [x] Limpiar filtros
- [x] Contador de hábitos filtrados vs totales
- [x] Mensaje cuando no hay resultados

### 2. Testing Básico ✅ COMPLETADO
- [x] Configurar Jest + Testing Library
- [x] Tests para validaciones de schemas:
  - [x] Habit schemas (create, update, full)
  - [x] Record schemas (create, update)
- [x] Tests para API validation
- [x] Scripts de test configurados:
  - `npm test` - Ejecuta todos los tests
  - `npm test:watch` - Modo watch
  - `npm test:coverage` - Genera reporte de cobertura
- [x] Configuración completa:
  - jest.config.js
  - jest.setup.js
  - Mapeo de rutas con @/
  - jsdom environment

### 3. Documentación de API ✅ COMPLETADO
- [x] Configurar Swagger con swagger-jsdoc y swagger-ui-react
- [x] Crear schemas de componentes (Habit, Record, CreateInputs, UpdateInputs, Error)
- [x] Documentar endpoints de hábitos:
  - [x] GET `/api/habits` - Listar hábitos
  - [x] POST `/api/habits` - Crear hábito
  - [x] GET `/api/habits/[id]` - Obtener hábito específico
  - [x] PATCH `/api/habits/[id]` - Actualizar hábito
  - [x] DELETE `/api/habits/[id]` - Eliminar hábito
- [x] Documentar endpoints de registros:
  - [x] GET `/api/records?habitId=xxx` - Listar registros
  - [x] POST `/api/records` - Crear/actualizar registro (upsert)
- [x] Configurar autenticación con Better Auth
- [x] Página de documentación interactiva en `/api-docs`
- [x] Endpoint JSON de Swagger en `/api/swagger`

---

## 🚀 Tareas a cargo del usuario

- Recuperación de contraseña (Forgot Password)
- Mejoras de UX/UI (Loading states, animaciones, etc.)
- Despliegue en Vercel (Plus)
- Video Demo (Plus)

---

## ✅ Completado

- [x] Autenticación (sign-up, sign-in, sign-out)
- [x] CRUD de hábitos
- [x] CRUD de registros con calendario visual
- [x] Estadísticas con gráficos (streaks, completion rate)
- [x] Editar hábitos con toggle activo/inactivo
- [x] Perfil de usuario con estadísticas generales
- [x] Cambiar contraseña
