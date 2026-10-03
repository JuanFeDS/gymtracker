import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.resolve('public', 'exercise-images');
const EXPECTED_COUNT = 40;

console.log('🔍 Verificando imágenes de ejercicios...\n');

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error(`❌ Error: No existe el directorio ${PUBLIC_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(PUBLIC_DIR).filter(f => f.endsWith('.jpg'));

console.log(`📊 Imágenes encontradas: ${files.length}/${EXPECTED_COUNT}\n`);

if (files.length === 0) {
  console.error('❌ No se encontraron imágenes JPG');
  process.exit(1);
}

const missing: string[] = [];
for (let i = 1; i <= EXPECTED_COUNT; i++) {
  const id = `ex_${String(i).padStart(3, '0')}`;
  const filename = `${id}.jpg`;
  if (!files.includes(filename)) {
    missing.push(filename);
  }
}

if (missing.length > 0) {
  console.log('⚠️  Imágenes faltantes:');
  missing.forEach(f => console.log(`   - ${f}`));
  console.log('');
}

console.log('✅ Primeras 5 imágenes:');
files.slice(0, 5).forEach(f => {
  const stats = fs.statSync(path.join(PUBLIC_DIR, f));
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`   ${f} (${sizeKB} KB)`);
});

console.log('\n📁 Ruta completa:', PUBLIC_DIR);
console.log('🌐 URL esperada en la app: /exercise-images/ex_001.jpg');
console.log('\n💡 Tip: En Vite, los archivos en public/ se sirven desde la raíz (/)');
