import { useState } from 'react';

interface OnboardingViewProps {
    onSubmit: (data: { alias: string; pin: string; goal?: 'fuerza' | 'hipertrofia' | 'resistencia' }) => void;
    onLogin: (alias: string, pin: string) => Promise<{ success: boolean }>;
    syncing?: boolean;
    authError?: string | null;
}

const goals: { label: string; value: 'fuerza' | 'hipertrofia' | 'resistencia' }[] = [
    { label: 'Fuerza', value: 'fuerza' },
    { label: 'Hipertrofia', value: 'hipertrofia' },
    { label: 'Resistencia', value: 'resistencia' }
];

const OnboardingView: React.FC<OnboardingViewProps> = ({ onSubmit, onLogin, syncing = false, authError }) => {
    const [alias, setAlias] = useState('');
    const [pin, setPin] = useState('');
    const [goal, setGoal] = useState<'fuerza' | 'hipertrofia' | 'resistencia' | undefined>(undefined);
    const [mode, setMode] = useState<'create' | 'login'>('create');
    const [loginAlias, setLoginAlias] = useState('');
    const [loginPin, setLoginPin] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);

    const isValid = alias.trim().length >= 2 && pin.trim().length >= 4;
    const isLoginValid = loginAlias.trim().length >= 2 && loginPin.trim().length >= 4;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid) return;
        onSubmit({ alias: alias.trim(), pin, goal });
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isLoginValid) return;
        const result = await onLogin(loginAlias.trim(), loginPin);
        if (!result.success) {
            setLoginError('Alias o PIN incorrecto.');
        } else {
            setLoginError(null);
        }
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2>{mode === 'create' ? 'Crea tu perfil' : 'Inicia sesión'}</h2>
                            <p>{mode === 'create' ? 'Solo necesitas un alias y un PIN de 4 dígitos.' : 'Ingresa tu alias existente para sincronizar tus datos.'}</p>
                        </div>
                        <button type="button" className="mode-switch" onClick={() => {
                            setMode(prev => (prev === 'create' ? 'login' : 'create'));
                            setLoginError(null);
                        }}>
                            {mode === 'create' ? 'Ya tengo cuenta' : 'Quiero crear una cuenta'}
                        </button>
                    </div>
                </header>

                {mode === 'create' ? (
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
                            <span>Contraseña</span>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="••••••"
                            />
                            <small>Usa al menos 4 caracteres. Se sincroniza de forma privada.</small>
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

                        <button type="submit" className="cta-primary" disabled={!isValid || syncing}>
                            {syncing ? 'Sincronizando...' : 'Crear perfil'}
                        </button>
                    </form>
                ) : (
                    <form className="onboarding-form" onSubmit={handleLogin}>
                        <label>
                            <span>Alias</span>
                            <input
                                type="text"
                                value={loginAlias}
                                onChange={(e) => setLoginAlias(e.target.value)}
                                placeholder="Ej. iron_jmart"
                            />
                        </label>
                        <label>
                            <span>Contraseña</span>
                            <input
                                type="password"
                                value={loginPin}
                                onChange={(e) => setLoginPin(e.target.value)}
                                placeholder="••••••"
                            />
                        </label>
                        {(loginError || authError) && (
                            <p className="form-error">{loginError ?? authError}</p>
                        )}
                        <button type="submit" className="cta-primary" disabled={!isLoginValid || syncing}>
                            {syncing ? 'Verificando...' : 'Ingresar'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default OnboardingView;
