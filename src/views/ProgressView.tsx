import type { CompletedSession } from '../types';
import VolumeBarChart from '../components/charts/VolumeBarChart';

interface ProgressViewProps {
    sessions: CompletedSession[];
}

const StatTile = ({ label, value }: { label: string; value: string }) => (
    <div className="glass" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
        <h3>{value}</h3>
    </div>
);

const ProgressView: React.FC<ProgressViewProps> = ({ sessions }) => {
    const totalSessions = sessions.length;
    const totalVolume = sessions.reduce((acc, session) => acc + (session.metrics?.totalVolume ?? 0), 0);
    const totalMinutes = sessions.reduce((acc, session) => acc + (session.metrics?.durationMinutes ?? 0), 0);
    const bestVolume = Math.max(0, ...sessions.map(session => session.metrics?.totalVolume ?? 0));

    if (totalSessions === 0) {
        return (
            <div className="glass" style={{ padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Sin historial aún</h3>
                <p>Completa tu primera sesión para comenzar a ver estadísticas.</p>
            </div>
        );
    }

    return (
        <div className="progress-grid">
            <div className="progress-card">
                <h4>Resumen general</h4>
                <div className="stat-grid">
                    <StatTile label="Sesiones" value={String(totalSessions)} />
                    <StatTile label="Volumen total" value={`${totalVolume} kg`} />
                    <StatTile label="Minutos acumulados" value={`${totalMinutes} min`} />
                    <StatTile label="Mejor volumen" value={`${bestVolume} kg`} />
                </div>
            </div>

            <div className="progress-card">
                <div className="tile-header">
                    <div>
                        <p>Evolución</p>
                        <h3>Tus últimos entrenos</h3>
                    </div>
                </div>
                <VolumeBarChart sessions={sessions} />
            </div>

            <div className="progress-card progress-timeline">
                <h4>Historial reciente</h4>
                <div className="timeline-list">
                    {sessions.slice(0, 10).map((session) => (
                        <div key={session.id} className="timeline-item">
                            <div>
                                <p className="timeline-date">{new Date(session.startTime).toLocaleDateString()}</p>
                                <h5>{session.exercises.length} ejercicios</h5>
                            </div>
                            <div className="timeline-meta">
                                <span>{session.metrics?.totalVolume ?? 0} kg</span>
                                <span>{session.metrics?.durationMinutes ?? 0} min</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProgressView;
