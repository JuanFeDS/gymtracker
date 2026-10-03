import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMissions() {
  console.log('🔍 Verificando estado de misiones...\n');

  const { data: users } = await supabase.from('users').select('user_id, username').limit(1);
  
  if (!users || users.length === 0) {
    console.log('❌ No hay usuarios en la BD');
    return;
  }

  const userId = users[0].user_id;
  console.log(`👤 Usuario: ${users[0].username} (${userId})\n`);

  const { data: userMissions } = await supabase
    .from('user_missions')
    .select(`
      user_mission_id,
      mission_id,
      progress,
      completed,
      missions (
        title,
        mission_type,
        goal_value,
        reward_xp
      )
    `)
    .eq('user_id', userId)
    .order('progress', { ascending: false })
    .limit(10);

  if (!userMissions || userMissions.length === 0) {
    console.log('⚠️  Usuario no tiene misiones asignadas');
    return;
  }

  console.log(`📊 Misiones del usuario (mostrando top 10 por progreso):\n`);
  
  userMissions.forEach((um: any) => {
    const mission = um.missions;
    const progressPercent = ((um.progress / mission.goal_value) * 100).toFixed(1);
    const status = um.completed ? '✅' : '⏳';
    
    console.log(`${status} ${mission.title}`);
    console.log(`   Tipo: ${mission.mission_type}`);
    console.log(`   Progreso: ${um.progress} / ${mission.goal_value} (${progressPercent}%)`);
    console.log(`   XP: ${mission.reward_xp}`);
    console.log('');
  });

  const { data: sessions } = await supabase
    .from('sessions')
    .select('session_id, total_sets, total_volume')
    .eq('user_id', userId);

  console.log(`\n📈 Estadísticas del usuario:`);
  console.log(`   Sesiones completadas: ${sessions?.length || 0}`);
  console.log(`   Sets totales: ${sessions?.reduce((acc, s) => acc + Number(s.total_sets || 0), 0) || 0}`);
  console.log(`   Volumen total: ${sessions?.reduce((acc, s) => acc + Number(s.total_volume || 0), 0) || 0} kg`);
}

checkMissions();
