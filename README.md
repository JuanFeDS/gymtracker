# GymTracker

> Dashboard personal para registrar entrenamientos, métricas corporales y progreso, con sincronización en Supabase y experiencia mobile-first.

## ⚙️ Stack principal

- React 19 + TypeScript
- Vite 7 para bundling y HMR
- Supabase como backend (REST + tablas `users`, `weights`, `sessions`)
- ECharts para visualizaciones

## 🚀 Funcionalidades clave

1. **Onboarding con registro/login**
   - Alias, email obligatorio, PIN de 4 dígitos y objetivo (fuerza/hipertrofia/resistencia).
   - Registro exitoso = inicio de sesión automático con sincronización en la nube.

2. **Sesiones de entrenamiento**
   - Inicio/parada de sesiones con ejercicios, sets y métricas agregadas.
   - Últimas 3 sesiones visibles desde la pestaña *Workout* con modal de detalle animado.

3. **Seguimiento de peso corporal**
   - Logging diario conectado a Supabase (compatible con RLS).
   - Eliminación remota + actualización instantánea del UI.

4. **Gamificación y progreso**
   - Estadísticas premium de XP, streaks y misiones.
   - Vistas de progreso con gráficas + animaciones globales (fade, slide, stagger).

5. **Perfil y seguridad**
   - Edición de alias, email, PIN y objetivo.
   - Botón rojo de cierre de sesión con modal personalizado que aclara que los datos permanecen en la nube.

## 📁 Estructura relevante

```
src/
├─ components/        # Layout, navegación, modales
├─ hooks/             # useUserProfile, useWeightLogs, useWorkoutSession, etc.
├─ services/          # Integraciones Supabase (userService, weightService, sessionService)
├─ views/             # Home, Workout, Weight, Progress, Gamification, Profile, Onboarding
└─ types.ts           # Tipos compartidos (UserProfile, WeightLog, CompletedSession...)
```

## 📦 Requisitos previos

- Node.js ≥ 18
- Cuenta de Supabase con tablas configuradas y RLS acorde al proyecto
- Variables de entorno (archivo `.env`):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## 🛠️ Configuración y uso

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar entorno**
   - Copia `.env.example` (si existe) o crea `.env` con las claves anteriores.
   - Garantiza que las tablas `users`, `weights`, `sessions`, `session_exercises` usen UUID en `user_id`.

3. **Correr en desarrollo**
   ```bash
   npm run dev
   ```
   La app queda disponible en `http://localhost:5173`.

4. **Build de producción**
   ```bash
   npm run build
   npm run preview
   ```

5. **Lint** (opcional)
   ```bash
   npm run lint
   ```

## 🔐 Notas sobre datos y RLS

- Todos los datos sensibles viven en Supabase; la app guarda caches locales mínimos para UX.
- RLS: las políticas deben permitir operaciones basadas en `user_id` cuando se usa la anon key.
- Al cerrar sesión solo se limpia el estado local; la información remota permanece intacta.

## 🧪 Flujo recomendado para QA

1. Crear nuevo perfil → debe iniciar sesión automáticamente.
2. Registrar un peso → confirmar el registro en Supabase.
3. Completar una sesión → comprobarla en la pestaña Workout y en el modal.
4. Cerrar sesión → volver a iniciar con alias/PIN para validar sincronización.

## 📌 Roadmap corto

- Recuperación de PIN vía email.
- Sincronización remota completa de sesiones históricas.
- Tests automatizados para hooks críticos (`useUserProfile`, `useWeightLogs`).

---

¿Necesitas pasos extra (deploy, scripts de migración, etc.)? Avísame y lo añadimos.
