import { useState } from 'react';
import ActiveSession from '../features/ActiveSession';
import SessionDetailModal from '../components/SessionDetailModal';
import type { CompletedSession, WorkoutSession } from '../types';

interface WorkoutViewProps {
    session: WorkoutSession | null;
    recentSessions: CompletedSession[];
    onStart: () => void;
    onFinish: () => void;
    onUpdate: (session: WorkoutSession) => void;
}

const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short'
});

const WorkoutView: React.FC<WorkoutViewProps> = ({ session, recentSessions, onStart, onFinish, onUpdate }) => {
    const [selectedSession, setSelectedSession] = useState<CompletedSession | null>(null);

    if (!session) {
        return (
            <>
            <div className="glass animate-fade-scale" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Sin entrenamiento activo</h3>
                <p style={{ marginBottom: 'var(--spacing-lg)' }}>Prepárate y comienza tu próximo workout.</p>
                <button
                    onClick={onStart}
                    className="animate-fade-in"
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        background: 'var(--primary)',
                        color: 'black',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 0 20px var(--primary-glow)'
                    }}
                >
                    INICIAR ENTRENAMIENTO
                </button>

                {recentSessions.length > 0 && (
                    <div style={{ marginTop: 'var(--spacing-xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                            <h4 style={{ margin: 0 }}>Últimas sesiones</h4>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>3 más recientes</span>
                        </div>
                        <div className="flex flex-col gap-sm stagger-enter">
                            {recentSessions.map(recent => (
                                <button
                                    key={recent.id}
                                    onClick={() => setSelectedSession(recent)}
                                    className="animate-fade-scale"
                                    style={{
                                        border: 'none',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        padding: 0
                                    }}
                                >
                                    <div className="glass" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(recent.endTime)}</p>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{recent.metrics.totalVolume} kg · {recent.metrics.totalSets} sets</p>
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{recent.metrics.durationMinutes} min</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {selectedSession && (
                <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />
            )}
            </>
        );
    }

    return (
        <ActiveSession
            session={session}
            onUpdate={onUpdate}
            onFinish={onFinish}
        />
    );
};

export default WorkoutView;
