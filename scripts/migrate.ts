import { config as loadEnv } from 'dotenv';
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { Pool } from 'pg';

loadEnv();

const MIGRATIONS = [
  '001_create_base_tables.sql',
  '002_seed_initial_data.sql'
];

function buildConnectionString(): string {
  const directUrl = process.env.DATABASE_URL;
  if (directUrl) return directUrl;

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const password = process.env.DATABASE_PASSWORD;
  const dbName = process.env.DATABASE_NAME ?? 'postgres';

  if (!supabaseUrl || !password) {
    throw new Error('Variables requeridas: VITE_SUPABASE_URL y DATABASE_PASSWORD');
  }

  const parsed = new URL(supabaseUrl);
  const host = parsed.hostname;
  const parts = host.split('.');
  const projectRef = parts[0];
  const domain = parts.slice(1).join('.');
  const dbHost = `db.${projectRef}.${domain}`;

  return `postgresql://postgres:${password}@${dbHost}:5432/${dbName}`;
}

async function runMigration(pool: Pool, filePath: string) {
  const sql = (await readFile(filePath, 'utf-8')).trim();
  if (!sql) {
    console.warn(`[WARN] ${filePath} está vacío, se omite.`);
    return;
  }
  await pool.query(sql);
  console.log(`[OK] ${filePath}`);
}

async function main() {
  const baseDir = resolve(process.cwd(), 'database', 'migrations');
  const connectionString = buildConnectionString();
  console.log('Conectando a:', connectionString.split('@')[1]);

  const pool = new Pool({ connectionString });
  try {
    for (const file of MIGRATIONS) {
      const target = join(baseDir, file);
      console.log('Ejecutando', file);
      await runMigration(pool, target);
    }
  } finally {
    await pool.end();
  }

  console.log('\n✅ Migraciones completadas');
}

main().catch(err => {
  console.error('Error al ejecutar migraciones:', err.message);
  process.exit(1);
});
