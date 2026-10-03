import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateExercisesJSON() {
  console.log('📋 Obteniendo ejercicios desde la base de datos...\n');

  const { data: exercises, error } = await supabase
    .from('exercises')
    .select('exercise_id, exercise_name, category, muscle_group, equipment')
    .order('exercise_id', { ascending: true });

  if (error) {
    console.error('❌ Error al obtener ejercicios:', error.message);
    process.exit(1);
  }

  if (!exercises || exercises.length === 0) {
    console.error('❌ No se encontraron ejercicios en la base de datos');
    process.exit(1);
  }

  const exerciseList = exercises.map(ex => {
    const muscleGroup = ex.muscle_group || '';
    const equipment = ex.equipment || '';
    
    const specificTerms = [
      ex.exercise_name,
      muscleGroup,
      equipment !== 'Peso corporal' ? equipment : '',
      'exercise',
      'fitness'
    ].filter(Boolean).join(' ');

    return {
      id: ex.exercise_id,
      name: ex.exercise_name,
      category: ex.category,
      muscleGroup: ex.muscle_group,
      searchQuery: specificTerms
    };
  });

  const outputPath = path.resolve('data', 'exercises.json');
  const dataDir = path.dirname(outputPath);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(exerciseList, null, 2), 'utf8');

  console.log(`✅ Archivo generado: ${outputPath}`);
  console.log(`📊 Total de ejercicios: ${exerciseList.length}\n`);
  console.log('Primeros 5 ejercicios:');
  exerciseList.slice(0, 5).forEach(ex => {
    console.log(`  - ${ex.id}: ${ex.name}`);
  });
}

generateExercisesJSON();
