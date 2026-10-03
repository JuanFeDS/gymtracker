import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error('Debes definir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (o SERVICE_ROLE_KEY) en tu .env');
}

const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

async function main() {
  const { data, error } = await supabase
    .from('users')
    .select('user_id, username, user_email')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error al consultar ejercicios:', error.message);
    process.exit(1);
  }

  console.log('Últimos usuarios creados:');
  console.table(data);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
