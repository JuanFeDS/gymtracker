import type { WeightLog } from '../types';

interface WeightViewProps {
    logs: WeightLog[];
    newValue: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    loading?: boolean;
}

const WeightView: React.FC<WeightViewProps> = ({ logs, newValue, onChange, onSubmit, loading = false }) => (
    <div className="flex flex-col gap-md">
        <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Registrar peso</h3>
            <div className="flex gap-sm">
                <input
                    type="number"
                    value={newValue}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="e.g. 75"
                    style={{
                        flex: 1,
                        background: 'var(--surface-color)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--spacing-md)',
                        color: 'var(--text-main)'
                    }}
                />
                <button
                    onClick={onSubmit}
                    disabled={loading}
                    style={{
                        padding: '0 var(--spacing-lg)',
                        background: loading ? 'var(--border)' : 'var(--primary)',
                        color: loading ? 'var(--text-muted)' : 'black',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)'
                    }}
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
        </div>

        <div className="flex flex-col gap-sm">
            {logs.map((log) => (
                <div key={log.id} className="glass flex justify-between items-center" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontWeight: 600 }}>{log.weight} kg</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.date}</span>
                </div>
            ))}
            {logs.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>Aún no tienes registros</p>}
        </div>
    </div>
);

export default WeightView;
