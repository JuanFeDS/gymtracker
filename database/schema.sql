-- Supabase schema for GymTracker data domain

create table if not exists public.users (
  user_id uuid primary key default gen_random_uuid(),
  user_email text,
  username text,
  password text,
  user_goal text,
  avatar_color text,
  created_at date,
  updated_at date
);

create table if not exists public.weights (
  weight_id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(user_id) on delete cascade,
  recorded_at date,
  weight_kg float4
);

create table if not exists public.sessions (
  session_id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(user_id) on delete cascade,
  started_at timestamptz,
  ended_at timestamptz,
  total_sets numeric,
  total_volume float4,
  duration_min numeric,
  notes text,
  created_at date
);

create table if not exists public.session_exercises (
  session_exercise_id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(session_id) on delete cascade,
  exercise_id uuid,
  exercise_name text,
  category text,
  sets numeric,
  repetitions numeric,
  weight float4,
  order_index numeric
);

create table if not exists public.missions (
  mission_id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  type text,
  reward_xp numeric,
  goal_value numeric,
  created_at date
);

create table if not exists public.user_missions (
  user_mission_id uuid primary key default gen_random_uuid(),
  mission_id uuid references public.missions(mission_id) on delete cascade,
  user_id uuid references public.users(user_id) on delete cascade,
  progress numeric,
  completed boolean,
  created_at date,
  updated_at date
);
