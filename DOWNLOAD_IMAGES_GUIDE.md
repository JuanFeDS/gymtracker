# Guía: Descarga de Imágenes de Ejercicios

Esta guía explica cómo descargar automáticamente imágenes para todos los ejercicios de la base de datos usando la API de Pexels.

## 📋 Requisitos Previos

1. **API Key de Pexels**
   - Ya configurada en tu `.env` como `PEXELS_API_KEY`
   - Si no la tienes, obtén una gratis en: https://www.pexels.com/api/

2. **Dependencias instaladas**
   ```bash
   npm install
   ```

## 🚀 Proceso de Descarga

### Paso 1: Generar archivo JSON de ejercicios

Este script lee todos los ejercicios desde la base de datos y crea un archivo JSON con la información necesaria para buscar imágenes.

```bash
npm run generate-exercises-json
```

**Resultado:**
- Crea el archivo `data/exercises.json` con todos los ejercicios
- Muestra el total de ejercicios encontrados
- Lista los primeros 5 ejercicios como preview

### Paso 2: Descargar imágenes

Este script busca y descarga una imagen para cada ejercicio desde Pexels.

```bash
npm run download-images
```

**Características:**
- ✅ Descarga imágenes en formato JPG (medium quality)
- ✅ Guarda en `public/exercise-images/`
- ✅ Usa el ID del ejercicio como nombre de archivo (ej: `ex_001.jpg`)
- ✅ Salta ejercicios que ya tienen imagen descargada
- ✅ Delay de 500ms entre requests para respetar límites de API
- ✅ Muestra progreso en tiempo real
- ✅ Resumen final con estadísticas

**Límites de API:**
- Pexels Free: 200 requests/hora
- Si tienes 40 ejercicios, tardará ~20 segundos (con delays)

## 📁 Estructura de Archivos

```
gymtracker/
├── data/
│   └── exercises.json          # Generado automáticamente
├── public/
│   └── exercise-images/        # Imágenes descargadas
│       ├── ex_001.jpg
│       ├── ex_002.jpg
│       └── ...
└── scripts/
    ├── generate-exercises-json.ts
    └── download-exercise-images.ts
```

## 🔧 Uso en la Aplicación

Una vez descargadas las imágenes, puedes usarlas en tu app:

```tsx
// En tu componente de ejercicio
<img 
  src={`/exercise-images/${exercise.id}.jpg`} 
  alt={exercise.name}
  loading="lazy"
/>
```

## ⚠️ Notas Importantes

1. **Calidad de búsqueda:** El script busca imágenes con el query `"[nombre ejercicio] gym exercise workout"`. Si alguna imagen no es apropiada, puedes:
   - Editarla manualmente en `data/exercises.json` (campo `searchQuery`)
   - Eliminar la imagen descargada y volver a ejecutar el script

2. **Imágenes faltantes:** Si algún ejercicio no encuentra imagen:
   - Aparecerá en el resumen como "Fallida"
   - Puedes buscar manualmente en Pexels y guardarla con el ID correcto

3. **Optimización:** Las imágenes descargadas son de calidad media. Para producción considera:
   - Convertir a WebP para mejor compresión
   - Usar un CDN (Cloudinary, Imgix)
   - Implementar lazy loading

## 🔄 Re-ejecutar el Script

Si necesitas volver a descargar imágenes:

```bash
# Eliminar imágenes existentes
rm -rf public/exercise-images/*

# Volver a descargar
npm run download-images
```

El script es inteligente y solo descarga las que faltan, así que puedes ejecutarlo múltiples veces sin problema.

## 📊 Ejemplo de Salida

```
📋 Total de ejercicios a procesar: 40

[1/40] 🔍 Buscando: Press de banca...
[1/40] ✅ Descargada: Press de banca
[2/40] 🔍 Buscando: Press inclinado con mancuernas...
[2/40] ✅ Descargada: Press inclinado con mancuernas
...

==================================================
📊 RESUMEN:
   ✅ Exitosas: 38
   ❌ Fallidas: 2
   📁 Ubicación: C:\...\public\exercise-images
==================================================
```

## 🆘 Solución de Problemas

**Error: "Cannot find module 'axios'"**
```bash
npm install
```

**Error: "PEXELS_API_KEY no definida"**
- Verifica que tu `.env` tenga la línea: `PEXELS_API_KEY=tu_api_key`

**Error: "No se encuentra data/exercises.json"**
```bash
npm run generate-exercises-json
```

**Límite de API excedido (429)**
- Espera 1 hora y vuelve a ejecutar
- El script continuará desde donde quedó
