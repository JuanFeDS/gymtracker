import type { WorkoutStats } from '../hooks/useWorkoutStats';
import type { WeightTrend } from '../hooks/useWeightTrend';
import type { WeightLog, CompletedSession } from '../types';
import WeightTrendChart from '../components/charts/WeightTrendChart';
import { useWeeklyStats } from '../hooks/useWeeklyStats';

interface HomeViewProps {
    stats: WorkoutStats;
    weightTrend: WeightTrend;
    weightLogs: WeightLog[];
    sessions: CompletedSession[];
    hasActiveSession: boolean;
    onStartSession: () => void;
    onFinishSession: () => void;
    onContinueSession?: () => void;
    weeklyGoal?: number;
}

const StatCard = ({ label, value, helper }: { label: string; value: string; helper?: string }) => (
    <div
        className="glass"
        style={{
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.3s ease',
            cursor: 'default'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(64, 224, 208, 0.15)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
        {helper && <p style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.6 }}>{helper}</p>}
    </div>
);

const HomeView: React.FC<HomeViewProps> = ({ stats, weightTrend, weightLogs, sessions, hasActiveSession, onStartSession, onFinishSession, onContinueSession, weeklyGoal = 30 }) => {
    const trendLabel = weightTrend.direction === 'flat' ? 'Sin cambios' : weightTrend.direction === 'down' ? 'Bajando' : 'Subiendo';
    const ctaLabel = hasActiveSession ? 'Continuar sesión' : 'Iniciar nueva sesión';
    const handlePrimaryAction = hasActiveSession ? (onContinueSession || onStartSession) : onStartSession;

    const weeklyStats = useWeeklyStats(sessions);
    const weeklyProgress = Math.min(100, Math.round((weeklyStats.weeklySets / weeklyGoal) * 100));

    return (
        <div className="home-grid">
            <div className="home-card home-card--tall">
                <div className="tile-header">
                    <div>
                        <p>Resumen rápido</p>
                        <h3 style={{ fontSize: '1.4rem' }}>Tu rendimiento</h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Actualizado hoy</span>
                </div>
                <div className="stat-grid">
                    <StatCard label="Sets totales" value={String(stats.totalSets)} helper={`Ejercicios: ${stats.exerciseCount}`} />
                    <StatCard label="Volumen" value={`${stats.totalVolume} kg`} helper={`Duración: ${stats.durationMinutes} min`} />
                    <StatCard label="Peso reciente" value={weightTrend.latest ? `${weightTrend.latest} kg` : '--'} helper={`${trendLabel} ${weightTrend.delta || ''}`} />
                </div>
            </div>

            <div className="home-card home-card--wide">
                <div className="tile-header">
                    <div>
                        <p>Peso corporal</p>
                        <h3 style={{ fontSize: '1.3rem' }}>Tendencia reciente</h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: trendLabel === 'Bajando' ? 'var(--accent)' : 'var(--primary)' }}>
                        {trendLabel} {weightTrend.delta ? `${weightTrend.delta} kg` : ''}
                    </span>
                </div>
                <WeightTrendChart data={weightLogs} />
            </div>

            <div className="home-card">
                <div className="tile-header">
                    <div>
                        <p>Sesiones</p>
                        <h3 style={{ fontSize: '1.25rem' }}>Acciones rápidas</h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: hasActiveSession ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {hasActiveSession ? 'Sesión en progreso' : 'Listo para empezar'}
                    </span>
                </div>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                    <button
                        onClick={handlePrimaryAction}
                        style={{
                            flex: 1,
                            minWidth: '160px',
                            padding: 'var(--spacing-md)',
                            background: 'var(--primary)',
                            color: 'black',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-md)'
                        }}
                    >
                        {ctaLabel}
                    </button>
                    {hasActiveSession && (
                        <button
                            onClick={onFinishSession}
                            style={{
                                flex: 1,
                                minWidth: '160px',
                                padding: 'var(--spacing-md)',
                                background: 'var(--surface-hover)',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 600
                            }}
                        >
                            Finalizar sesión
                        </button>
                    )}
                </div>
            </div>

            <div className="home-card">
                <div className="tile-header">
                    <div>
                        <p>Meta semanal</p>
                        <h3 style={{ fontSize: '1.2rem' }}>Sets completados</h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{weeklyStats.weeklySets}/{weeklyGoal}</span>
                </div>
                <div className="progress-shell">
                    <div className="progress-fill" style={{ width: `${weeklyProgress}%` }} />
                </div>
                <p style={{ marginTop: 'var(--spacing-sm)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {weeklyStats.weeklySets >= weeklyGoal ? (
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>🎉 ¡Meta alcanzada! Sigue así</span>
                    ) : (
                        `Te faltan ${weeklyGoal - weeklyStats.weeklySets} sets para alcanzar tu objetivo`
                    )}
                </p>
            </div>
        </div>
    );
};

export default HomeView;
