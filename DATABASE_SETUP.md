# Configuración de Base de Datos - GymTracker

Este documento describe cómo configurar e importar los datos iniciales en Supabase para GymTracker.

## 📁 Estructura de Archivos

```
database/
├── seed/
│   ├── exercises.csv         # 40 ejercicios predefinidos
│   ├── missions.csv          # 40 misiones de gamificación
│   ├── muscle_groups.csv     # 15 grupos musculares
│   └── equipment.csv         # 15 tipos de equipamiento
└── migrations/
    ├── 001_create_base_tables.sql    # Crear tablas base
    └── 002_seed_initial_data.sql     # Insertar datos iniciales
```

## 🚀 Proceso de Configuración

### Paso 1: Crear las Tablas Base

1. Accede al **SQL Editor** en tu proyecto de Supabase
2. Ejecuta el script `database/migrations/001_create_base_tables.sql`
3. Verifica que se crearon las siguientes tablas:
   - `exercises` - Ejercicios predefinidos
   - `muscle_groups` - Grupos musculares
   - `equipment` - Equipamiento
   - `missions` - Misiones de gamificación

### Paso 2: Importar Datos desde CSV

Tienes dos opciones para importar los datos:

#### Opción A: Importación Manual via Dashboard (Recomendado)

1. Ve a **Table Editor** en Supabase
2. Para cada tabla, haz clic en **Import data from CSV**
3. Selecciona el archivo CSV correspondiente:
   - `muscle_groups.csv` → tabla `muscle_groups`
   - `equipment.csv` → tabla `equipment`
   - `exercises.csv` → tabla `exercises`
   - `missions.csv` → tabla `missions`
4. Verifica que los datos se importaron correctamente

#### Opción B: Importación via SQL

1. Accede al **SQL Editor**
2. Ejecuta el script `database/migrations/002_seed_initial_data.sql`
3. Este script contiene INSERT statements para los datos más importantes
4. Para importar TODOS los datos (40 ejercicios, 40 misiones), usa la Opción A

### Paso 3: Verificar la Importación

Ejecuta las siguientes queries para verificar:

```sql
-- Verificar ejercicios
SELECT COUNT(*) FROM exercises;
-- Debe retornar 40

-- Verificar misiones
SELECT COUNT(*) FROM missions;
-- Debe retornar 40

-- Verificar grupos musculares
SELECT COUNT(*) FROM muscle_groups;
-- Debe retornar 15

-- Verificar equipamiento
SELECT COUNT(*) FROM equipment;
-- Debe retornar 15
```

## 📊 Descripción de Datos

### Ejercicios (40 total)

Categorías incluidas:
- **Pecho**: Press de banca, aperturas, fondos
- **Piernas**: Sentadillas, peso muerto, prensa
- **Espalda**: Dominadas, remos, jalones
- **Hombros**: Press militar, elevaciones laterales
- **Brazos**: Curls, extensiones, fondos
- **Core**: Planchas, crunches, elevaciones
- **Cardio**: Burpees, jumping jacks, box jumps

Niveles de dificultad:
- Principiante: 15 ejercicios
- Intermedio: 20 ejercicios
- Avanzado: 4 ejercicios
- Experto: 1 ejercicio

### Misiones (40 total)

Categorías incluidas:
- **Inicio**: Primera sesión
- **Progreso**: Completar X sesiones
- **Consistencia**: Rachas de días consecutivos
- **Volumen**: Levantar X kg totales
- **Sets**: Completar X sets totales
- **Duración**: Entrenar X minutos
- **Variedad**: Probar diferentes ejercicios
- **Especialización**: Enfoque en grupos musculares
- **Tracking**: Registrar peso corporal
- **Transformación**: Cambios de peso

Tipos de misiones:
- `session_count` - Contar sesiones completadas
- `streak_days` - Días consecutivos de entrenamiento
- `total_volume` - Volumen total levantado (kg)
- `total_sets` - Sets totales completados
- `session_duration` - Duración de sesión (minutos)
- `unique_exercises` - Ejercicios únicos probados
- `muscle_group_focus` - Sesiones enfocadas en grupo muscular
- `weight_logs` - Registros de peso corporal
- `weight_change` - Cambio de peso (kg)

### Grupos Musculares (15 total)

Organizados por categorías:
- **Pecho**: Pectorales
- **Espalda**: Dorsales, Lumbares, Trapecios
- **Hombros**: Deltoides
- **Brazos**: Bíceps, Tríceps, Antebrazos
- **Piernas**: Cuádriceps, Isquiotibiales, Glúteos, Gemelos
- **Core**: Abdominales, Oblicuos, Erectores

### Equipamiento (15 total)

Categorías:
- **Peso libre**: Barra, Mancuernas, Kettlebell, Disco
- **Sin equipo**: Peso corporal
- **Máquinas**: Máquina guiada, Polea
- **Accesorios**: Banco, Paralelas, Caja pliométrica
- **Otros**: TRX, Bandas elásticas, Battle ropes

## 🔐 Seguridad (RLS)

Todas las tablas tienen Row Level Security habilitado:

- **Lectura (SELECT)**: Permitida para todos los usuarios
- **Escritura (INSERT/UPDATE/DELETE)**: Bloqueada desde la app

Esto asegura que:
- Los usuarios pueden ver todos los ejercicios y misiones disponibles
- Los datos predefinidos no pueden ser modificados desde la aplicación
- Solo administradores pueden modificar estos datos via SQL Editor

## 🔄 Actualización de Datos

Para añadir o modificar ejercicios/misiones:

1. Edita el archivo CSV correspondiente
2. Re-importa usando el Dashboard de Supabase
3. O ejecuta un UPDATE/INSERT manual via SQL Editor

Ejemplo para añadir un nuevo ejercicio:

```sql
INSERT INTO exercises (
  exercise_id, 
  exercise_name, 
  category, 
  muscle_group, 
  equipment, 
  difficulty, 
  description
) VALUES (
  'ex_041',
  'Nombre del ejercicio',
  'Categoría',
  'Grupo muscular',
  'Equipamiento',
  'Principiante',
  'Descripción del ejercicio'
);
```

## 📝 Notas Importantes

1. **IDs únicos**: Todos los IDs siguen el formato `prefix_NNN` (ej: `ex_001`, `mis_001`)
2. **Orden de importación**: Importa primero `muscle_groups` y `equipment`, luego `exercises` y `missions`
3. **Duplicados**: Los scripts SQL usan `ON CONFLICT DO NOTHING` para evitar duplicados
4. **Encoding**: Los archivos CSV están en UTF-8 para soportar caracteres especiales

## 🆘 Solución de Problemas

### Error: "duplicate key value violates unique constraint"
- Ya existen datos con esos IDs
- Usa `ON CONFLICT DO NOTHING` o elimina los datos existentes primero

### Error: "permission denied for table"
- Verifica que RLS esté configurado correctamente
- Asegúrate de estar usando el usuario correcto en Supabase

### Los datos no aparecen en la app
- Verifica que las políticas RLS permitan SELECT
- Revisa que los nombres de columnas coincidan con los esperados en el código

## 🔗 Referencias

- [Documentación de Supabase - Import Data](https://supabase.com/docs/guides/database/import-data)
- [Documentación de Supabase - Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- Ver `SUPABASE_SCHEMA.md` para el esquema completo de la base de datos
