# Esquema de Base de Datos Supabase

Este documento describe la estructura de tablas y políticas RLS necesarias para GymTracker.

## Tablas

### 1. `users`
Almacena los perfiles de usuario.

```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL,
  password TEXT NOT NULL,
  user_goal TEXT CHECK (user_goal IN ('fuerza', 'hipertrofia', 'resistencia')),
  avatar_color TEXT DEFAULT '#40E0D0',
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL
);

CREATE INDEX idx_users_username ON users(username);
```

**Políticas RLS:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Permitir lectura del propio perfil
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (true);

-- Permitir inserción de nuevos usuarios
CREATE POLICY "Anyone can create user"
  ON users FOR INSERT
  WITH CHECK (true);

-- Permitir actualización del propio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (user_id = auth.uid() OR true);
```

### 2. `weights`
Registros de peso corporal.

```sql
CREATE TABLE weights (
  weight_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0 AND weight_kg <= 500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weights_user_id ON weights(user_id);
CREATE INDEX idx_weights_recorded_at ON weights(recorded_at DESC);
```

**Políticas RLS:**
```sql
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;

-- Permitir lectura de propios registros
CREATE POLICY "Users can read own weights"
  ON weights FOR SELECT
  USING (true);

-- Permitir inserción de propios registros
CREATE POLICY "Users can insert own weights"
  ON weights FOR INSERT
  WITH CHECK (true);

-- Permitir eliminación de propios registros
CREATE POLICY "Users can delete own weights"
  ON weights FOR DELETE
  USING (true);
```

### 3. `sessions`
Sesiones de entrenamiento completadas.

```sql
CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NOT NULL,
  total_sets INTEGER DEFAULT 0,
  total_reps INTEGER DEFAULT 0,
  total_volume NUMERIC(10,2) DEFAULT 0,
  created_at DATE NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);
```

**Políticas RLS:**
```sql
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Permitir lectura de propias sesiones
CREATE POLICY "Users can read own sessions"
  ON sessions FOR SELECT
  USING (true);

-- Permitir inserción/actualización de propias sesiones
CREATE POLICY "Users can upsert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (true);
```

### 4. `session_exercises`
Ejercicios individuales dentro de cada sesión.

```sql
CREATE TABLE session_exercises (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight NUMERIC(6,2),
  exercise_order INTEGER NOT NULL
);

CREATE INDEX idx_session_exercises_session_id ON session_exercises(session_id);
```

**Políticas RLS:**
```sql
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;

-- Permitir lectura de ejercicios de sesiones propias
CREATE POLICY "Users can read own session exercises"
  ON session_exercises FOR SELECT
  USING (true);

-- Permitir inserción de ejercicios en sesiones propias
CREATE POLICY "Users can insert own session exercises"
  ON session_exercises FOR INSERT
  WITH CHECK (true);
```

### 5. `user_missions`
Sistema de gamificación - misiones y logros del usuario.

```sql
CREATE TABLE user_missions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  mission_name TEXT NOT NULL,
  mission_description TEXT,
  xp_reward INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_missions_user_id ON user_missions(user_id);
CREATE INDEX idx_user_missions_completed ON user_missions(completed);
```

**Políticas RLS:**
```sql
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

-- Permitir lectura de propias misiones
CREATE POLICY "Users can read own missions"
  ON user_missions FOR SELECT
  USING (true);

-- Permitir actualización de propias misiones
CREATE POLICY "Users can update own missions"
  ON user_missions FOR UPDATE
  USING (true);
```

## Configuración Inicial

### 1. Crear las tablas
Ejecuta los scripts SQL anteriores en el editor SQL de Supabase en el orden listado.

### 2. Habilitar RLS
Todas las tablas tienen Row Level Security habilitado. Las políticas permiten operaciones basadas en `user_id`.

### 3. Configurar variables de entorno
En tu proyecto local, crea un archivo `.env` basado en `.env.example`:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 4. Configurar secrets en GitHub
Para el despliegue automático, configura los siguientes secrets en tu repositorio:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Notas Importantes

1. **Seguridad**: Las políticas RLS actuales usan `true` para simplificar el desarrollo. En producción, deberías usar `auth.uid()` para verificar que el usuario autenticado coincida con el `user_id` de los registros.

2. **Autenticación**: Este proyecto usa un sistema de autenticación personalizado (alias + PIN) en lugar de Supabase Auth. Para mayor seguridad, considera migrar a Supabase Auth en el futuro.

3. **Índices**: Los índices creados optimizan las consultas más frecuentes (por usuario y fecha).

4. **Cascadas**: Las relaciones usan `ON DELETE CASCADE` para mantener la integridad referencial cuando se elimina un usuario.

## Migraciones Futuras

Si necesitas modificar el esquema:

1. Exporta el esquema actual desde Supabase
2. Crea un archivo de migración en `database/migrations/`
3. Documenta los cambios en este archivo
4. Aplica la migración en Supabase
5. Actualiza los tipos TypeScript en `src/types.ts` si es necesario
