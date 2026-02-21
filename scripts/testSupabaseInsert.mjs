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

const prompt = (label, value) => console.log(`${label}:`, value);

const formatDate = () => new Date().toISOString().slice(0, 10);

const buildUserPayload = () => {
    const suffix = Date.now();
    return {
        user_id: randomUUID(),
        user_email: `debug_${suffix}@example.com`,
        username: `tester_${suffix}`,
        password: 'debug-1234',
        user_goal: 'fuerza',
        avatar_color: `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')}`,
        created_at: formatDate(),
        updated_at: formatDate()
    };
};

const run = async () => {
    console.log('Insertando usuario de prueba en tabla users...');

    const userPayload = buildUserPayload();
    prompt('Payload', userPayload);

    const { data, error } = await supabase
        .from('users')
        .insert(userPayload)
        .select('user_id')
        .single();

    if (error || !data?.user_id) {
        console.error('Error al crear usuario:', error?.message ?? 'sin ID retornado');
        process.exit(1);
    }

    console.log('Insert en users exitoso. ID:', data.user_id);
};

run().catch((err) => {
    console.error('Fallo inesperado:', err);
    process.exit(1);
});
