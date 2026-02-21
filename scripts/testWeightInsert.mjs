import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const REQUIRED_ENVS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missing = REQUIRED_ENVS.filter((key) => !process.env[key]);

if (missing.length) {
    console.error(`Faltan variables de entorno: ${missing.join(', ')}`);
    process.exit(1);
}

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const today = () => new Date().toISOString().slice(0, 10);

const run = async () => {
    const userId = process.env.TEST_USER_ID;
    if (!userId) {
        console.error('Define TEST_USER_ID en tu .env con el UUID del usuario al que asignarás el peso.');
        process.exit(1);
    }

    const payload = {
        weight_id: randomUUID(),
        user_id: userId,
        recorded_at: today(),
        weight_kg: Number(process.env.TEST_WEIGHT_KG ?? 75)
    };

    console.log('Insertando peso de prueba...', payload);

    const { data, error } = await supabase
        .from('weights')
        .insert(payload)
        .select('weight_id');

    if (error) {
        console.error('Error al insertar peso:', error.message);
        process.exit(1);
    }

    console.log('Insert en weights exitoso. ID:', data?.[0]?.weight_id ?? 'desconocido');
};

run().catch((err) => {
    console.error('Fallo inesperado:', err);
    process.exit(1);
});
