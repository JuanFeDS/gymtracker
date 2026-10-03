import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function validateDatabase() {
  console.log('🔍 Validando estado de la base de datos...\n');

  const { data: exercises, error: exError } = await supabase
    .from('exercises')
    .select('exercise_id, exercise_name, category, muscle_group, equipment')
    .limit(5);

  if (exError) {
    console.error('❌ Error al consultar exercises:', exError.message);
  } else {
    console.log(`✅ Ejercicios en BD: ${exercises?.length || 0} registros (mostrando primeros 5)`);
    console.table(exercises);
  }

  const { data: missions, error: misError } = await supabase
    .from('missions')
    .select('mission_id, title, mission_type, reward_xp')
    .limit(5);

  if (misError) {
    console.error('❌ Error al consultar missions:', misError.message);
  } else {
    console.log(`\n✅ Misiones en BD: ${missions?.length || 0} registros (mostrando primeras 5)`);
    console.table(missions);
  }

  const { data: users, error: userError } = await supabase
    .from('users')
    .select('user_id, username, user_email')
    .limit(3);

  if (userError) {
    console.error('❌ Error al consultar users:', userError.message);
  } else {
    console.log(`\n✅ Usuarios en BD: ${users?.length || 0} registros`);
    console.table(users);
  }

  const { data: sessions, error: sessError } = await supabase
    .from('sessions')
    .select('session_id, total_sets, total_volume, duration_min')
    .limit(3);

  if (sessError) {
    console.error('❌ Error al consultar sessions:', sessError.message);
  } else {
    console.log(`\n✅ Sesiones en BD: ${sessions?.length || 0} registros`);
    console.table(sessions);
  }

  console.log('\n✅ Validación completada');
}

validateDatabase();
