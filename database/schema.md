---
description: Esquema Supabase GymTracker
---

# Esquema de Base de Datos

Documento de referencia para las tablas creadas en `schema.sql`. Se actualizaron los nombres y columnas para reflejar el estado final de Supabase.

## Tabla: `users`
- **Descripción:** Almacena la identidad básica de cada atleta (alias, PIN/contraseña, avatar y objetivo).
- **Campos:**
  - `user_id`: `uuid` **PK**. Default `gen_random_uuid()`.
  - `user_email`: `text`. Sin default ni restricción de unicidad.
  - `username`: `text`. Alias mostrado en la app.
  - `password`: `text`. Puede almacenar el PIN hasheado.
  - `user_goal`: `text`. Objetivo libre (fuerza, hipertrofia, etc.).
  - `avatar_color`: `text`.
  - `created_at`: `date` (sin default).
  - `updated_at`: `date` (sin default).

## Tabla: `weights`
- **Descripción:** Registros históricos del peso corporal. Reemplaza al antiguo `weight_logs`.
- **Campos:**
  - `weight_id`: `uuid` **PK**. Default `gen_random_uuid()`.
  - `user_id`: `uuid` FK `users(user_id)` con `on delete cascade`.
  - `recorded_at`: `date`.
  - `weight_kg`: `float4`.

## Tabla: `sessions`
- **Descripción:** Información resumida de cada entrenamiento realizado.
- **Campos:**
  - `session_id`: `uuid` **PK**. Default `gen_random_uuid()`.
  - `user_id`: `uuid` FK `users(user_id)` con `on delete cascade`.
  - `started_at`: `timestamptz`.
  - `ended_at`: `timestamptz`.
  - `total_sets`: `numeric`.
  - `total_volume`: `float4`.
  - `duration_min`: `numeric`.
  - `notes`: `text`.
  - `created_at`: `date`.

## Tabla: `session_exercises`
- **Descripción:** Detalle por ejercicio dentro de una sesión, con totales agregados.
- **Campos:**
  - `session_exercise_id`: `uuid` **PK**. Default `gen_random_uuid()`.
  - `session_id`: `uuid` FK `sessions(session_id)` cascade.
  - `exercise_id`: `uuid` (opcional, enlaza con catálogo local si existe).
  - `exercise_name`: `text`.
  - `category`: `text`.
  - `sets`: `numeric`.
  - `repetitions`: `numeric`.
  - `weight`: `float4`.
  - `order_index`: `numeric`.

## Tabla: `missions`
- **Descripción:** Catálogo global de misiones que habilitan la gamificación.
- **Campos:**
  - `mission_id`: `uuid` **PK**. Default `gen_random_uuid()`.
  - `title`: `text`.
  - `description`: `text`.
  - `type`: `text` (por ejemplo `streak`, `volumen`).
  - `reward_xp`: `numeric`.
  - `goal_value`: `numeric`.
  - `created_at`: `date`.

## Tabla: `user_missions`
- **Descripción:** Progreso de cada usuario sobre las misiones activas.
- **Campos:**
  - `user_mission_id`: `uuid` **PK**. Default `gen_random_uuid()`.
  - `mission_id`: `uuid` FK `missions(mission_id)` cascade.
  - `user_id`: `uuid` FK `users(user_id)` cascade.
  - `progress`: `numeric`.
  - `completed`: `boolean`.
  - `created_at`: `date`.
  - `updated_at`: `date`.

## Notas
- Las tablas actuales no tienen `unique` adicionales, por lo que se recomienda crear vistas o triggers para validar duplicados si hacen falta.
- Los archivos CSV de ejemplo viven en `database/samples/` para facilitar cargas iniciales.
- Revisar políticas RLS antes de exponer endpoints; Supabase las desactiva por defecto hasta habilitarlas manualmente.
