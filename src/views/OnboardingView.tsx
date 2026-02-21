import { useState } from 'react';

interface OnboardingViewProps {
    onSubmit: (data: { alias: string; pin: string; goal?: 'fuerza' | 'hipertrofia' | 'resistencia' }) => void;
}

const goals: { label: string; value: 'fuerza' | 'hipertrofia' | 'resistencia' }[] = [
    { label: 'Fuerza', value: 'fuerza' },
    { label: 'Hipertrofia', value: 'hipertrofia' },
    { label: 'Resistencia', value: 'resistencia' }
];

const OnboardingView: React.FC<OnboardingViewProps> = ({ onSubmit }) => {
    const [alias, setAlias] = useState('');
    const [pin, setPin] = useState('');
    const [goal, setGoal] = useState<'fuerza' | 'hipertrofia' | 'resistencia' | undefined>(undefined);

    const isValid = alias.trim().length >= 2 && pin.length === 4;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid) return;
        onSubmit({ alias: alias.trim(), pin, goal });
    };

    return (
        <div className="onboarding-shell">
            <section className="onboarding-hero">
                <div>
                    <p className="chip">GymTracker</p>
                    <h1>Tu progreso, asegurado</h1>
                    <p>Configura un perfil rápido para guardar tus sesiones, gamificación y métricas. Todo queda listo para sincronizar con Sheets en la siguiente versión.</p>
                </div>
                <ul>
                    <li>Alias público para compartir tus logros.</li>
                    <li>PIN local para bloquear la app.</li>
                    <li>Objetivo para personalizar recomendaciones.</li>
                </ul>
            </section>

            <div className="onboarding-card">
                <header>
                    <h2>Crea tu perfil</h2>
                    <p>Solo necesitas un alias y un PIN de 4 dígitos.</p>
                </header>

                <form className="onboarding-form" onSubmit={handleSubmit}>
                    <label>
                        <span>Alias</span>
                        <input
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="Ej. TitanGains"
                        />
                        <small>{Math.max(0, 12 - alias.length)} caracteres disponibles</small>
                    </label>

                    <label>
                        <span>PIN de 4 dígitos</span>
                        <input
                            type="password"
                            maxLength={4}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="0000"
                        />
                        <small>No compartiremos este PIN, se almacena localmente.</small>
                    </label>

                    <div className="goal-selector">
                        <span>Objetivo principal</span>
                        <div className="goal-grid">
                            {goals.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    className={`goal-chip ${goal === item.value ? 'goal-chip--active' : ''}`}
                                    onClick={() => setGoal(item.value)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="cta-primary" disabled={!isValid}>
                        Crear perfil
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OnboardingView;
