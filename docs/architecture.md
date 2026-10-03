# Arquitectura GymTracker
Resumen de los módulos actuales, su comunicación y los puntos de extensión inmediatos para evolucionar la app hacia el roadmap definido.

## Componentes principales
- **`src/main.tsx`**: punto de entrada Vite + React, monta `<App />` dentro del contenedor raíz y aplica estilos globales.
- **`src/App.tsx`**: orquesta el estado global mínimo (sesión activa, registros de peso, pestaña seleccionada) y delega la UI en `Layout` y los feature modules.
- **`src/components/Layout.tsx`**: define el marco visual, manejo de tema claro/oscuro y render dinámico por pestañas; incluye `BottomNav` como navegación principal.
- **`src/features/ActiveSession.tsx`**: módulo central para registrar ejercicios, sets y pesos dentro de una sesión en curso.
- **`src/components/BottomNav.tsx`**: navegación inferior con pestañas para Workout, Weight, Progress y Academy (gamificación futura).
- **`src/types.ts`**: tipado compartido para sesiones, ejercicios y nuevos registros de peso/métricas.

## Gestión de estado y persistencia
- **Estado local React**: `useState` dentro de `App.tsx` maneja la sesión activa y el historial de pesos; pestañas se controlan desde `Layout`.
- **Persistencia**: actualmente se usa `localStorage` directamente desde `App.tsx`. Se introduce `utils/storage.ts` para centralizar serialización, manejar errores y preparar futuras capas (Sheets/LLM).
- **Tipos normalizados**: `WorkoutSession` ahora incluye `metrics` opcional (sets totales, volumen, duración) y se crea `WeightLog` para unificar registros de peso corporal.

## Puntos de extensión inmediatos
1. **Persistencia remota**: adaptar `storage.ts` para delegar en un cliente de Google Sheets cuando exista conectividad.
2. **Contextos globales**: mover sesión activa y usuario a context providers para facilitar autenticación e integración LLM.
3. **Hooks reutilizables**: `hooks/useWorkoutStats.ts` y `hooks/useWeightTrend.ts` consumirán los tipos normalizados para generar KPIs.
4. **Módulo de usuarios**: futura capa `services/sheetsClient.ts` + `context/UserContext.tsx` compartirán el token/alias del usuario.

## Checklist de calidad inmediata
- Limpiar `console.log` y manejar errores de lectura/escritura para evitar corrupción de datos locales.
- Documentar decisiones en este archivo y mantenerlo actualizado conforme se creen nuevas vistas o servicios.
- Mantener cada archivo debajo de 120 líneas separando responsabilidades en módulos pequeños.
