import ActiveSession from '../features/ActiveSession';
import type { WorkoutSession } from '../types';

interface WorkoutViewProps {
    session: WorkoutSession | null;
    onStart: () => void;
    onFinish: () => void;
    onUpdate: (session: WorkoutSession) => void;
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ session, onStart, onFinish, onUpdate }) => {
    if (!session) {
        return (
            <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Sin entrenamiento activo</h3>
                <p style={{ marginBottom: 'var(--spacing-lg)' }}>Prepárate y comienza tu próximo workout.</p>
                <button
                    onClick={onStart}
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
            </div>
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
