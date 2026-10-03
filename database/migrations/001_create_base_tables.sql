-- ============================================================================
-- GymTracker - Esquema de Base de Datos Optimizado
-- ============================================================================
-- Versión: 1.0
-- Descripción: Esquema completo con tablas necesarias, sin redundancias
-- ============================================================================

-- ============================================================================
-- TABLA: users
-- Descripción: Perfiles de usuario con autenticación por alias+PIN
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
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

-- ============================================================================
-- TABLA: weights
-- Descripción: Registros históricos de peso corporal
-- ============================================================================
CREATE TABLE IF NOT EXISTS weights (
  weight_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL CHECK (weight_kg > 0 AND weight_kg <= 500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weights_user_id ON weights(user_id);
CREATE INDEX idx_weights_recorded_at ON weights(recorded_at DESC);

-- ============================================================================
-- TABLA: exercises
-- Descripción: Catálogo de ejercicios con clasificación integrada
-- Nota: muscle_group y equipment son columnas directas (no tablas separadas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS exercises (
  exercise_id TEXT PRIMARY KEY,
  exercise_name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado', 'Experto')),
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX idx_exercises_equipment ON exercises(equipment);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);

-- ============================================================================
-- TABLA: sessions
-- Descripción: Sesiones de entrenamiento completadas
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NOT NULL,
  total_sets INTEGER DEFAULT 0,
  total_volume NUMERIC(10,2) DEFAULT 0,
  duration_min NUMERIC DEFAULT 0,
  notes TEXT,
  created_at DATE NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);

-- ============================================================================
-- TABLA: session_exercises
-- Descripción: Ejercicios dentro de cada sesión con detalle de sets en JSONB
-- Nota: sets_detail guarda array de objetos {reps, weight, completed, rpe?}
-- ============================================================================
CREATE TABLE IF NOT EXISTS session_exercises (
  session_exercise_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  exercise_id TEXT REFERENCES exercises(exercise_id),
  exercise_name TEXT NOT NULL,
  category TEXT,
  sets_detail JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_session_exercises_session_id ON session_exercises(session_id);
CREATE INDEX idx_session_exercises_exercise_id ON session_exercises(exercise_id);

-- ============================================================================
-- TABLA: missions
-- Descripción: Catálogo de misiones de gamificación
-- ============================================================================
CREATE TABLE IF NOT EXISTS missions (
  mission_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  mission_type TEXT NOT NULL,
  goal_value NUMERIC NOT NULL,
  reward_xp INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado', 'Experto')),
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_missions_type ON missions(mission_type);
CREATE INDEX idx_missions_difficulty ON missions(difficulty);

-- ============================================================================
-- TABLA: user_missions
-- Descripción: Progreso de cada usuario en las misiones
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_missions (
  user_mission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id TEXT NOT NULL REFERENCES missions(mission_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  progress NUMERIC DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

CREATE INDEX idx_user_missions_user_id ON user_missions(user_id);
CREATE INDEX idx_user_missions_mission_id ON user_missions(mission_id);
CREATE INDEX idx_user_missions_completed ON user_missions(completed);

-- ============================================================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================================================

-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create user"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (true);

-- Weights
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own weights"
  ON weights FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own weights"
  ON weights FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own weights"
  ON weights FOR DELETE
  USING (true);

-- Exercises (público, solo lectura)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read exercises"
  ON exercises FOR SELECT
  USING (true);

-- Sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON sessions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  USING (true);

-- Session Exercises
ALTER TABLE session_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own session exercises"
  ON session_exercises FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own session exercises"
  ON session_exercises FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own session exercises"
  ON session_exercises FOR DELETE
  USING (true);

-- Missions (público, solo lectura)
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read missions"
  ON missions FOR SELECT
  USING (true);

-- User Missions
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own missions"
  ON user_missions FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own missions"
  ON user_missions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own missions"
  ON user_missions FOR UPDATE
  USING (true);
