import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import { config } from 'dotenv';

config();

const API_KEY = process.env.PEXELS_API_KEY;
const EXERCISES_FILE = path.resolve('data', 'exercises.json');
const OUTPUT_DIR = path.resolve('public', 'exercise-images');
const DELAY_MS = 500;

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  searchQuery: string;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchPhoto(query: string, exerciseIndex: number): Promise<string | null> {
  try {
    const page = Math.floor(exerciseIndex / 10) + 1;
    const photoIndex = exerciseIndex % 3;
    
    const { data } = await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: API_KEY! },
      params: { 
        query, 
        per_page: 5,
        page: page,
        orientation: 'landscape'
      }
    });
    
    if (!data.photos || data.photos.length === 0) {
      return null;
    }
    
    const selectedPhoto = data.photos[Math.min(photoIndex, data.photos.length - 1)];
    return selectedPhoto?.src?.medium ?? null;
  } catch (error) {
    console.error(`Error buscando foto para "${query}":`, (error as Error).message);
    return null;
  }
}

async function downloadImage(url: string, fileName: string): Promise<boolean> {
  try {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join(OUTPUT_DIR, `${fileName}.jpg`);
    fs.writeFileSync(filePath, data);
    return true;
  } catch (error) {
    console.error(`Error descargando imagen:`, (error as Error).message);
    return false;
  }
}

async function downloadExerciseImages() {
  if (!API_KEY) {
    console.error('❌ Error: Define PEXELS_API_KEY en tu archivo .env');
    process.exit(1);
  }

  if (!fs.existsSync(EXERCISES_FILE)) {
    console.error(`❌ Error: No se encuentra ${EXERCISES_FILE}`);
    console.log('💡 Ejecuta primero: npm run generate-exercises-json');
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Directorio creado: ${OUTPUT_DIR}\n`);
  }

  const exercises: Exercise[] = JSON.parse(fs.readFileSync(EXERCISES_FILE, 'utf8'));
  console.log(`📋 Total de ejercicios a procesar: ${exercises.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    const progress = `[${i + 1}/${exercises.length}]`;

    const existingImage = path.join(OUTPUT_DIR, `${exercise.id}.jpg`);
    if (fs.existsSync(existingImage)) {
      console.log(`${progress} ⏭️  Ya existe: ${exercise.name}`);
      successCount++;
      continue;
    }

    console.log(`${progress} 🔍 Buscando: ${exercise.name}...`);
    
    const photoUrl = await searchPhoto(exercise.searchQuery, i);
    
    if (!photoUrl) {
      console.log(`${progress} ⚠️  No encontrada: ${exercise.name}`);
      failCount++;
      await sleep(DELAY_MS);
      continue;
    }

    const downloaded = await downloadImage(photoUrl, exercise.id);
    
    if (downloaded) {
      console.log(`${progress} ✅ Descargada: ${exercise.name}`);
      successCount++;
    } else {
      console.log(`${progress} ❌ Error al descargar: ${exercise.name}`);
      failCount++;
    }

    await sleep(DELAY_MS);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMEN:');
  console.log(`   ✅ Exitosas: ${successCount}`);
  console.log(`   ❌ Fallidas: ${failCount}`);
  console.log(`   📁 Ubicación: ${OUTPUT_DIR}`);
  console.log('='.repeat(50));
}

downloadExerciseImages();
