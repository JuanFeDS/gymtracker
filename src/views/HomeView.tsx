import type { WorkoutStats } from '../hooks/useWorkoutStats';
import type { WeightTrend } from '../hooks/useWeightTrend';

interface HomeViewProps {
    stats: WorkoutStats;
    weightTrend: WeightTrend;
    hasActiveSession: boolean;
    onStartSession: () => void;
    onFinishSession: () => void;
}

const StatCard = ({ label, value, helper }: { label: string; value: string; helper?: string }) => (
    <div
        className="glass"
        style={{
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-md)',
            margin: 'var(--spacing-sm) 0'
        }}
    >
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
        {helper && <p style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.6 }}>{helper}</p>}
    </div>
);

const HomeView: React.FC<HomeViewProps> = ({ stats, weightTrend, hasActiveSession, onStartSession, onFinishSession }) => {
    const trendLabel = weightTrend.direction === 'flat' ? 'Sin cambios' : weightTrend.direction === 'down' ? 'Bajando' : 'Subiendo';
    const ctaLabel = hasActiveSession ? 'Continuar sesión' : 'Iniciar nueva sesión';

    return (
        <div className="flex flex-col gap-lg">
            <div
                className="grid"
                style={{
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}
            >
                <StatCard label="Sets totales" value={String(stats.totalSets)} helper={`Ejercicios: ${stats.exerciseCount}`} />
                <StatCard label="Volumen" value={`${stats.totalVolume} kg`} helper={`Duración: ${stats.durationMinutes} min`} />
                <StatCard label="Peso reciente" value={weightTrend.latest ? `${weightTrend.latest} kg` : '--'} helper={`${trendLabel} ${weightTrend.delta || ''}`} />
            </div>

            <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Acciones rápidas</p>
                        <h3 style={{ fontSize: '1.25rem' }}>Tu entrenamiento</h3>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: hasActiveSession ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {hasActiveSession ? 'Sesión en progreso' : 'Listo para empezar'}
                    </span>
                </div>
                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                    <button
                        onClick={onStartSession}
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
        </div>
    );
};

export default HomeView;
