# 📚 HabitFlow API Documentation

Esta documentación describe todos los endpoints disponibles en la API de HabitFlow.

## 🚀 Acceder a la Documentación

### Swagger UI (Interactiva)

La documentación interactiva de Swagger está disponible en:

```
http://localhost:3000/api-docs
```

Desde aquí podés:
- Ver todos los endpoints disponibles
- Probar las peticiones directamente desde el navegador
- Ver ejemplos de request y response
- Consultar los schemas de datos

### JSON de OpenAPI

El archivo JSON de especificación OpenAPI 3.0 está disponible en:

```
http://localhost:3000/api/swagger
```

## 🔐 Autenticación

Todos los endpoints de la API requieren autenticación mediante Better Auth.

El sistema usa cookies de sesión HTTP-only, por lo que:
- Debes estar autenticado en la aplicación
- Las peticiones desde el mismo dominio incluirán automáticamente las cookies
- Para testing desde herramientas externas (Postman, cURL), necesitás la cookie de sesión

## 📋 Endpoints Principales

### Hábitos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/habits` | Lista todos los hábitos activos del usuario |
| POST | `/api/habits` | Crea un nuevo hábito |
| GET | `/api/habits/[id]` | Obtiene un hábito específico con sus registros |
| PATCH | `/api/habits/[id]` | Actualiza un hábito (campos parciales) |
| DELETE | `/api/habits/[id]` | Elimina un hábito y todos sus registros |

### Registros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/records?habitId=xxx` | Lista todos los registros de un hábito |
| POST | `/api/records` | Crea o actualiza un registro (upsert) |
| PATCH | `/api/records/[id]` | Actualiza un registro existente |
| DELETE | `/api/records/[id]` | Elimina un registro |

## 📊 Schemas de Datos

### Habit (Hábito)

```typescript
{
  id: string;
  userId: string;
  name: string;              // 1-100 caracteres
  description?: string;      // Opcional, hasta 500 caracteres
  frequency: string;         // "daily", "weekly", etc.
  goal: number;              // 1-365 días
  color?: string;            // Código hexadecimal
  icon?: string;             // Emoji
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  records?: Record[];        // Incluido al hacer GET de un hábito específico
}
```

### Record (Registro)

```typescript
{
  id: string;
  habitId: string;
  date: Date;
  completed: boolean;
  notes?: string;            // Opcional, hasta 500 caracteres
  createdAt: Date;
  updatedAt: Date;
}
```

## 💡 Ejemplos de Uso

### Crear un Hábito

```bash
POST /api/habits
Content-Type: application/json

{
  "name": "Morning Exercise",
  "description": "30 minutes of cardio",
  "frequency": "daily",
  "goal": 7,
  "icon": "🏃",
  "color": "#3B82F6"
}
```

### Crear/Actualizar un Registro

```bash
POST /api/records
Content-Type: application/json

{
  "habitId": "habit-id-here",
  "date": "2025-10-23",
  "completed": true,
  "notes": "Great workout today!"
}
```

### Actualizar un Hábito

```bash
PATCH /api/habits/[id]
Content-Type: application/json

{
  "active": false,
  "description": "Updated description"
}
```

## ⚠️ Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Error de validación - Datos inválidos |
| 401 | No autenticado - Requiere login |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

## 🛠️ Validación

Todos los endpoints validan los datos de entrada usando Zod schemas:

- **Hábitos**: `createHabitSchema`, `updateHabitSchema`
- **Registros**: `createRecordSchema`, `updateRecordSchema`

Los errores de validación (400) incluyen detalles específicos sobre qué campos fallaron.

## 📝 Notas Adicionales

### Upsert de Registros

El endpoint `POST /api/records` hace upsert automático:
- Si existe un registro para el mismo `habitId` y `date`, lo actualiza
- Si no existe, crea uno nuevo

Esto permite marcar/desmarcar hábitos sin preocuparse por duplicados.

### Soft Delete

Actualmente los hábitos eliminados se borran permanentemente.
Se recomienda usar el campo `active: false` para "archivar" hábitos en lugar de eliminarlos.

### Límite de Registros

Al hacer GET de todos los hábitos, cada uno incluye solo los últimos 30 registros para optimizar performance.

Para obtener todos los registros de un hábito, usa `GET /api/records?habitId=xxx`.
