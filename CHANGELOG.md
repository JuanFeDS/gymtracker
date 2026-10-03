# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [0.1.0] - 2026-03-08

### Added
- Sistema de onboarding con registro y login mediante alias/PIN
- Sesiones de entrenamiento con tracking de ejercicios, sets y métricas agregadas
- Seguimiento de peso corporal con sincronización en tiempo real a Supabase
- Sistema de gamificación con XP, streaks y misiones
- Vistas de progreso con gráficas interactivas usando ECharts
- Perfil de usuario editable (alias, email, PIN, objetivo)
- Deploy automático a GitHub Pages mediante GitHub Actions
- Integración completa con Supabase (tablas users, weights, sessions, session_exercises, user_missions)
- Políticas RLS para seguridad de datos por usuario
- UI mobile-first con navegación por pestañas
- Animaciones y transiciones para mejor UX
- Sistema de notificaciones Toast para feedback visual de operaciones
- Error Boundary global para manejo robusto de errores de React
- Validaciones de input (peso, PIN, email) antes de enviar a Supabase
- Lazy loading de vistas para optimizar tiempo de carga inicial
- Documentación completa de esquemas Supabase (`SUPABASE_SCHEMA.md`)
- Archivo `.env.example` para facilitar configuración inicial
- Archivos CSV con datos predefinidos (40 ejercicios, 40 misiones, grupos musculares, equipamiento)
- Scripts SQL de migración para crear tablas e importar datos iniciales
- Documentación completa de configuración de base de datos (`DATABASE_SETUP.md`)

### Changed
- Servicios refactorizados para retornar `ServiceResult<T>` con manejo de errores mejorado
- Hooks actualizados para consumir nuevos tipos de servicio y mostrar errores al usuario
- Mensajes de error específicos y amigables en lugar de solo logs de consola
- Workflow de CI/CD ahora ejecuta lint antes del build

### Infrastructure
- Configuración de Vite 7 + React 19 + TypeScript
- ESLint para calidad de código
- Workflow de CI/CD para despliegue automático con validación de lint
- Code splitting automático mediante React.lazy() y Suspense
