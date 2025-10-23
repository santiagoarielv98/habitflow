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

### 3. Documentación de API
- [ ] Crear `API.md` con documentación completa
- [ ] Documentar endpoints de hábitos:
  - [ ] GET `/api/habits` - Listar hábitos
  - [ ] POST `/api/habits` - Crear hábito
  - [ ] PATCH `/api/habits/[id]` - Actualizar hábito
  - [ ] DELETE `/api/habits/[id]` - Eliminar hábito
- [ ] Documentar endpoints de registros:
  - [ ] GET `/api/records?habitId=xxx` - Listar registros
  - [ ] POST `/api/records` - Crear/actualizar registro
  - [ ] PATCH `/api/records/[id]` - Actualizar registro
  - [ ] DELETE `/api/records/[id]` - Eliminar registro
- [ ] Documentar endpoints de autenticación:
  - [ ] POST `/api/auth/sign-up` - Registro
  - [ ] POST `/api/auth/sign-in` - Login
  - [ ] POST `/api/auth/sign-out` - Logout
  - [ ] POST `/api/auth/change-password` - Cambiar contraseña
- [ ] Incluir ejemplos de request/response
- [ ] Incluir códigos de error

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
