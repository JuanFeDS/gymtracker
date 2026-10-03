-- ============================================================================
-- GymTracker - Datos Iniciales
-- ============================================================================
-- Versión: 1.0
-- Descripción: Insertar datos de ejercicios y misiones
-- ============================================================================

-- ============================================================================
-- EXERCISES - Catálogo completo de 40 ejercicios
-- ============================================================================
INSERT INTO exercises (exercise_id, exercise_name, category, muscle_group, equipment, difficulty, description) VALUES
('ex_001', 'Press de banca', 'Pecho', 'Pectorales', 'Barra', 'Intermedio', 'Ejercicio compuesto para desarrollo de pecho'),
('ex_002', 'Press inclinado con mancuernas', 'Pecho', 'Pectorales', 'Mancuernas', 'Intermedio', 'Desarrollo del pecho superior'),
('ex_003', 'Aperturas con mancuernas', 'Pecho', 'Pectorales', 'Mancuernas', 'Principiante', 'Aislamiento de pectorales'),
('ex_004', 'Fondos en paralelas', 'Pecho', 'Pectorales', 'Peso corporal', 'Intermedio', 'Ejercicio compuesto para pecho y tríceps'),
('ex_005', 'Press de banca inclinado', 'Pecho', 'Pectorales', 'Barra', 'Intermedio', 'Enfoque en pecho superior'),
('ex_006', 'Sentadilla con barra', 'Piernas', 'Cuádriceps', 'Barra', 'Intermedio', 'Rey de los ejercicios de pierna'),
('ex_007', 'Peso muerto', 'Piernas', 'Isquiotibiales', 'Barra', 'Avanzado', 'Ejercicio compuesto para cadena posterior'),
('ex_008', 'Prensa de pierna', 'Piernas', 'Cuádriceps', 'Máquina', 'Principiante', 'Desarrollo de cuádriceps'),
('ex_009', 'Zancadas', 'Piernas', 'Cuádriceps', 'Mancuernas', 'Principiante', 'Ejercicio unilateral para piernas'),
('ex_010', 'Curl femoral', 'Piernas', 'Isquiotibiales', 'Máquina', 'Principiante', 'Aislamiento de isquiotibiales'),
('ex_011', 'Extensión de cuádriceps', 'Piernas', 'Cuádriceps', 'Máquina', 'Principiante', 'Aislamiento de cuádriceps'),
('ex_012', 'Elevaciones de talones', 'Piernas', 'Gemelos', 'Máquina', 'Principiante', 'Desarrollo de pantorrillas'),
('ex_013', 'Dominadas', 'Espalda', 'Dorsales', 'Peso corporal', 'Intermedio', 'Ejercicio compuesto para espalda'),
('ex_014', 'Remo con barra', 'Espalda', 'Dorsales', 'Barra', 'Intermedio', 'Desarrollo de espalda media'),
('ex_015', 'Jalón al pecho', 'Espalda', 'Dorsales', 'Máquina', 'Principiante', 'Alternativa a dominadas'),
('ex_016', 'Remo con mancuerna', 'Espalda', 'Dorsales', 'Mancuernas', 'Principiante', 'Ejercicio unilateral de espalda'),
('ex_017', 'Peso muerto rumano', 'Espalda', 'Lumbares', 'Barra', 'Intermedio', 'Enfoque en cadena posterior'),
('ex_018', 'Press militar', 'Hombros', 'Deltoides', 'Barra', 'Intermedio', 'Desarrollo de hombros'),
('ex_019', 'Elevaciones laterales', 'Hombros', 'Deltoides', 'Mancuernas', 'Principiante', 'Aislamiento de deltoides laterales'),
('ex_020', 'Elevaciones frontales', 'Hombros', 'Deltoides', 'Mancuernas', 'Principiante', 'Enfoque en deltoides frontales'),
('ex_021', 'Pájaros', 'Hombros', 'Deltoides', 'Mancuernas', 'Principiante', 'Desarrollo de deltoides posteriores'),
('ex_022', 'Press Arnold', 'Hombros', 'Deltoides', 'Mancuernas', 'Intermedio', 'Variante de press de hombros'),
('ex_023', 'Curl de bíceps con barra', 'Brazos', 'Bíceps', 'Barra', 'Principiante', 'Ejercicio básico de bíceps'),
('ex_024', 'Curl martillo', 'Brazos', 'Bíceps', 'Mancuernas', 'Principiante', 'Desarrollo de braquial'),
('ex_025', 'Curl concentrado', 'Brazos', 'Bíceps', 'Mancuernas', 'Principiante', 'Aislamiento de bíceps'),
('ex_026', 'Press francés', 'Brazos', 'Tríceps', 'Barra', 'Intermedio', 'Desarrollo de tríceps'),
('ex_027', 'Extensiones de tríceps', 'Brazos', 'Tríceps', 'Polea', 'Principiante', 'Aislamiento de tríceps'),
('ex_028', 'Fondos para tríceps', 'Brazos', 'Tríceps', 'Peso corporal', 'Intermedio', 'Ejercicio compuesto para tríceps'),
('ex_029', 'Patada de tríceps', 'Brazos', 'Tríceps', 'Mancuernas', 'Principiante', 'Aislamiento de tríceps'),
('ex_030', 'Plancha', 'Core', 'Abdominales', 'Peso corporal', 'Principiante', 'Ejercicio isométrico de core'),
('ex_031', 'Crunches', 'Core', 'Abdominales', 'Peso corporal', 'Principiante', 'Ejercicio básico de abdominales'),
('ex_032', 'Elevación de piernas', 'Core', 'Abdominales', 'Peso corporal', 'Intermedio', 'Enfoque en abdomen bajo'),
('ex_033', 'Russian twist', 'Core', 'Oblicuos', 'Peso corporal', 'Intermedio', 'Desarrollo de oblicuos'),
('ex_034', 'Mountain climbers', 'Core', 'Abdominales', 'Peso corporal', 'Intermedio', 'Ejercicio dinámico de core'),
('ex_035', 'Burpees', 'Cardio', 'Full body', 'Peso corporal', 'Intermedio', 'Ejercicio de alta intensidad'),
('ex_036', 'Jumping jacks', 'Cardio', 'Full body', 'Peso corporal', 'Principiante', 'Calentamiento cardiovascular'),
('ex_037', 'Box jumps', 'Cardio', 'Piernas', 'Peso corporal', 'Intermedio', 'Ejercicio pliométrico'),
('ex_038', 'Battle ropes', 'Cardio', 'Full body', 'Cuerdas', 'Intermedio', 'Entrenamiento de alta intensidad'),
('ex_039', 'Kettlebell swing', 'Full body', 'Glúteos', 'Kettlebell', 'Intermedio', 'Ejercicio balístico'),
('ex_040', 'Thruster', 'Full body', 'Full body', 'Barra', 'Avanzado', 'Combinación de sentadilla y press')
ON CONFLICT (exercise_id) DO NOTHING;

-- ============================================================================
-- MISSIONS - Catálogo completo de 40 misiones
-- ============================================================================
INSERT INTO missions (mission_id, title, description, mission_type, goal_value, reward_xp, difficulty, category) VALUES
('mis_001', 'Primer Paso', 'Completa tu primera sesión de entrenamiento', 'session_count', 1, 50, 'Principiante', 'Inicio'),
('mis_002', 'Guerrero Novato', 'Completa 5 sesiones de entrenamiento', 'session_count', 5, 100, 'Principiante', 'Progreso'),
('mis_003', 'Atleta Dedicado', 'Completa 10 sesiones de entrenamiento', 'session_count', 10, 200, 'Intermedio', 'Progreso'),
('mis_004', 'Maestro del Gimnasio', 'Completa 25 sesiones de entrenamiento', 'session_count', 25, 500, 'Avanzado', 'Progreso'),
('mis_005', 'Leyenda del Fitness', 'Completa 50 sesiones de entrenamiento', 'session_count', 50, 1000, 'Experto', 'Progreso'),
('mis_006', 'Centurión', 'Completa 100 sesiones de entrenamiento', 'session_count', 100, 2500, 'Experto', 'Progreso'),
('mis_007', 'Racha de Fuego', 'Entrena 3 días consecutivos', 'streak_days', 3, 75, 'Principiante', 'Consistencia'),
('mis_008', 'Semana Perfecta', 'Entrena 7 días consecutivos', 'streak_days', 7, 200, 'Intermedio', 'Consistencia'),
('mis_009', 'Mes Imparable', 'Entrena 30 días consecutivos', 'streak_days', 30, 1000, 'Avanzado', 'Consistencia'),
('mis_010', 'Volumen Inicial', 'Levanta 1000 kg de volumen total', 'total_volume', 1000, 100, 'Principiante', 'Volumen'),
('mis_011', 'Levantador Serio', 'Levanta 5000 kg de volumen total', 'total_volume', 5000, 250, 'Intermedio', 'Volumen'),
('mis_012', 'Bestia de Hierro', 'Levanta 10000 kg de volumen total', 'total_volume', 10000, 500, 'Avanzado', 'Volumen'),
('mis_013', 'Titán del Gimnasio', 'Levanta 25000 kg de volumen total', 'total_volume', 25000, 1500, 'Experto', 'Volumen'),
('mis_014', 'Hércules Moderno', 'Levanta 50000 kg de volumen total', 'total_volume', 50000, 3000, 'Experto', 'Volumen'),
('mis_015', 'Sets de Acero', 'Completa 100 sets totales', 'total_sets', 100, 75, 'Principiante', 'Sets'),
('mis_016', 'Máquina de Sets', 'Completa 500 sets totales', 'total_sets', 500, 300, 'Intermedio', 'Sets'),
('mis_017', 'Rey de los Sets', 'Completa 1000 sets totales', 'total_sets', 1000, 750, 'Avanzado', 'Sets'),
('mis_018', 'Maratón Fitness', 'Entrena durante 60 minutos en una sesión', 'session_duration', 60, 100, 'Intermedio', 'Duración'),
('mis_019', 'Ultra Resistencia', 'Entrena durante 90 minutos en una sesión', 'session_duration', 90, 200, 'Avanzado', 'Duración'),
('mis_020', 'Sesión Épica', 'Entrena durante 120 minutos en una sesión', 'session_duration', 120, 400, 'Experto', 'Duración'),
('mis_021', 'Explorador', 'Prueba 5 ejercicios diferentes', 'unique_exercises', 5, 50, 'Principiante', 'Variedad'),
('mis_022', 'Versátil', 'Prueba 15 ejercicios diferentes', 'unique_exercises', 15, 150, 'Intermedio', 'Variedad'),
('mis_023', 'Maestro de Ejercicios', 'Prueba 30 ejercicios diferentes', 'unique_exercises', 30, 400, 'Avanzado', 'Variedad'),
('mis_024', 'Enciclopedia Viviente', 'Prueba 50 ejercicios diferentes', 'unique_exercises', 50, 800, 'Experto', 'Variedad'),
('mis_025', 'Día de Pecho', 'Completa una sesión enfocada en pecho', 'muscle_group_focus', 1, 75, 'Principiante', 'Especialización'),
('mis_026', 'Día de Piernas', 'Completa una sesión enfocada en piernas', 'muscle_group_focus', 1, 75, 'Principiante', 'Especialización'),
('mis_027', 'Día de Espalda', 'Completa una sesión enfocada en espalda', 'muscle_group_focus', 1, 75, 'Principiante', 'Especialización'),
('mis_028', 'Día de Hombros', 'Completa una sesión enfocada en hombros', 'muscle_group_focus', 1, 75, 'Principiante', 'Especialización'),
('mis_029', 'Día de Brazos', 'Completa una sesión enfocada en brazos', 'muscle_group_focus', 1, 75, 'Principiante', 'Especialización'),
('mis_030', 'Guerrero del Core', 'Completa 10 sesiones con ejercicios de core', 'core_sessions', 10, 200, 'Intermedio', 'Core'),
('mis_031', 'Madrugador', 'Completa una sesión antes de las 8 AM', 'early_session', 1, 100, 'Intermedio', 'Horario'),
('mis_032', 'Búho Nocturno', 'Completa una sesión después de las 8 PM', 'late_session', 1, 100, 'Intermedio', 'Horario'),
('mis_033', 'Fin de Semana Activo', 'Entrena un sábado o domingo', 'weekend_session', 1, 50, 'Principiante', 'Horario'),
('mis_034', 'Progreso Medible', 'Registra tu peso corporal 5 veces', 'weight_logs', 5, 50, 'Principiante', 'Tracking'),
('mis_035', 'Obsesionado con Datos', 'Registra tu peso corporal 20 veces', 'weight_logs', 20, 150, 'Intermedio', 'Tracking'),
('mis_036', 'Científico del Fitness', 'Registra tu peso corporal 50 veces', 'weight_logs', 50, 400, 'Avanzado', 'Tracking'),
('mis_037', 'Transformación Inicial', 'Pierde o gana 2 kg', 'weight_change', 2, 200, 'Intermedio', 'Transformación'),
('mis_038', 'Gran Transformación', 'Pierde o gana 5 kg', 'weight_change', 5, 500, 'Avanzado', 'Transformación'),
('mis_039', 'Metamorfosis Completa', 'Pierde o gana 10 kg', 'weight_change', 10, 1200, 'Experto', 'Transformación'),
('mis_040', 'Perfeccionista', 'Completa una sesión con todos los sets planificados', 'perfect_session', 1, 100, 'Intermedio', 'Calidad')
ON CONFLICT (mission_id) DO NOTHING;
