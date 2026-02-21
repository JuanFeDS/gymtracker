import type { CompletedSession } from '../types';

interface SessionDetailModalProps {
    session: CompletedSession;
    onClose: () => void;
}

const formatDateTime = (timestamp: number) => new Date(timestamp).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
});

const formatSet = (reps: number, weight: number) => `${reps} reps · ${weight} kg`;

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose }) => (
    <div style={backdropStyle}>
        <div className="glass" style={modalStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDateTime(session.endTime)}</p>
                    <h3 style={{ margin: 0 }}>Detalle de sesión</h3>
                </div>
                <button onClick={onClose} style={closeButtonStyle}>
                    Cerrar
                </button>
            </div>

            <div style={summaryStyle}>
                <div>
                    <p style={summaryLabel}>Volumen</p>
                    <strong>{session.metrics.totalVolume} kg</strong>
                </div>
                <div>
                    <p style={summaryLabel}>Sets</p>
                    <strong>{session.metrics.totalSets}</strong>
                </div>
                <div>
                    <p style={summaryLabel}>Duración</p>
                    <strong>{session.metrics.durationMinutes} min</strong>
                </div>
            </div>

            <div className="flex flex-col gap-md" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                {session.exercises.map(exercise => (
                    <div key={exercise.id} className="glass" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0 }}>{exercise.name}</h4>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exercise.sets.length} sets</span>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--spacing-sm) 0 0 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {exercise.sets.map(set => (
                                <li key={set.id} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {formatSet(set.reps, set.weight)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 'var(--spacing-lg)'
};

const modalStyle: React.CSSProperties = {
    width: 'min(480px, 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xl)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    background: 'var(--surface-color)'
};

const summaryStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-xl)'
};

const summaryLabel: React.CSSProperties = {
    margin: 0,
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
};

const closeButtonStyle: React.CSSProperties = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-main)',
    fontWeight: 600
};

export default SessionDetailModal;
