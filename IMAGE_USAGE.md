# Uso de Imágenes de Ejercicios en la App

## 📸 Imágenes Disponibles

Todas las imágenes de ejercicios están en `public/exercise-images/` y se cargan automáticamente desde el servicio de ejercicios.

## ✅ Implementación Actual

### 1. **ExercisePickerModal** ✅
Las imágenes ya están implementadas y funcionando:
- Lazy loading automático
- Fallback con emoji 💪 si la imagen falla
- Background color mientras carga

### 2. **ExerciseService** ✅
El servicio mapea automáticamente las imágenes:
```ts
image: `/exercise-images/${row.exercise_id}.jpg`
```

## 🎨 Cómo Usar las Imágenes

### Opción 1: Background Image (Actual)
```tsx
<div
  style={{ 
    backgroundImage: `url(${exercise.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '200px',
    borderRadius: 'var(--radius-md)'
  }}
/>
```

### Opción 2: Tag IMG con Lazy Loading
```tsx
<img 
  src={exercise.image} 
  alt={exercise.name}
  loading="lazy"
  style={{
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)'
  }}
  onError={(e) => {
    e.currentTarget.src = '/placeholder-exercise.jpg';
  }}
/>
```

### Opción 3: Con Overlay de Información
```tsx
<div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
  <img 
    src={exercise.image} 
    alt={exercise.name}
    loading="lazy"
    style={{
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    }}
  />
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '12px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: 'white'
  }}>
    <h4>{exercise.name}</h4>
    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>{exercise.category}</p>
  </div>
</div>
```

## 🔧 Lugares Donde Puedes Añadir Imágenes

### 1. **ActiveSession - Lista de Ejercicios**
Mostrar miniatura del ejercicio junto al nombre:

```tsx
// En src/features/ActiveSession.tsx
<div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
  <img 
    src={`/exercise-images/${ex.exerciseId}.jpg`}
    alt={ex.name}
    loading="lazy"
    style={{
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: 'var(--radius-sm)'
    }}
  />
  <div>
    <h4>{ex.name}</h4>
    <p>{ex.sets.length} sets</p>
  </div>
</div>
```

### 2. **ProgressView - Historial de Sesiones**
Mostrar ejercicios realizados con imágenes:

```tsx
// En src/views/ProgressView.tsx
<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
  {session.exercises.slice(0, 3).map(ex => (
    <img 
      key={ex.id}
      src={`/exercise-images/${ex.exerciseId}.jpg`}
      alt={ex.name}
      title={ex.name}
      loading="lazy"
      style={{
        width: '40px',
        height: '40px',
        objectFit: 'cover',
        borderRadius: '50%',
        border: '2px solid var(--border)'
      }}
    />
  ))}
</div>
```

### 3. **WorkoutView - Sesiones Recientes**
Galería de ejercicios de la última sesión:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
  {recentSession.exercises.map(ex => (
    <div key={ex.id} style={{ position: 'relative' }}>
      <img 
        src={`/exercise-images/${ex.exerciseId}.jpg`}
        alt={ex.name}
        loading="lazy"
        style={{
          width: '100%',
          aspectRatio: '1',
          objectFit: 'cover',
          borderRadius: 'var(--radius-sm)'
        }}
      />
    </div>
  ))}
</div>
```

## 🎯 Mejores Prácticas

1. **Siempre usa `loading="lazy"`** para mejor performance
2. **Añade `alt` descriptivo** para accesibilidad
3. **Usa `objectFit: 'cover'`** para mantener proporciones
4. **Implementa fallback** con `onError` handler
5. **Usa borderRadius** para mantener consistencia visual

## 🔄 Actualizar Imágenes

Si necesitas actualizar las imágenes:

```bash
# Eliminar imágenes actuales
rm -rf public/exercise-images/*

# Descargar nuevas imágenes
npm run download-images
```

## 📱 Responsive

Para diferentes tamaños de pantalla:

```tsx
<img 
  src={exercise.image}
  alt={exercise.name}
  loading="lazy"
  style={{
    width: '100%',
    height: 'auto',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: 'var(--radius-md)'
  }}
/>
```

## ✨ Estado Actual

- ✅ 40/40 ejercicios con imagen
- ✅ ExercisePickerModal implementado
- ✅ Lazy loading habilitado
- ✅ Fallback con emoji
- ✅ Servicio actualizado
