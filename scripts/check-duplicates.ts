import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  console.log('🔍 Verificando duplicados en session_exercises...\n');

  const { data: sessionExercises, error } = await supabase
    .from('session_exercises')
    .select('*')
    .order('session_id', { ascending: true });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`Total registros: ${sessionExercises?.length || 0}\n`);
  console.table(sessionExercises);

  const grouped = new Map<string, any[]>();
  sessionExercises?.forEach(ex => {
    const key = `${ex.session_id}-${ex.exercise_name}`;
    const arr = grouped.get(key) || [];
    arr.push(ex);
    grouped.set(key, arr);
  });

  console.log('\n📊 Agrupados por sesión + ejercicio:');
  grouped.forEach((exercises, key) => {
    if (exercises.length > 1) {
      console.log(`\n⚠️  DUPLICADO: ${key}`);
      console.log(`   Cantidad: ${exercises.length} registros`);
      exercises.forEach((ex, idx) => {
        console.log(`   [${idx + 1}] ID: ${ex.session_exercise_id}, Sets: ${JSON.stringify(ex.sets_detail)}`);
      });
    }
  });
}

checkDuplicates();
