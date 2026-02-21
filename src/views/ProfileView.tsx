import { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileViewProps {
    profile: UserProfile;
    onUpdate: (changes: Partial<Pick<UserProfile, 'alias' | 'pin' | 'goal'>>) => void;
    onLogout: () => void;
}

const goals: { label: string; value: 'fuerza' | 'hipertrofia' | 'resistencia' }[] = [
    { label: 'Fuerza', value: 'fuerza' },
    { label: 'Hipertrofia', value: 'hipertrofia' },
    { label: 'Resistencia', value: 'resistencia' }
];

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onUpdate, onLogout }) => {
    const [alias, setAlias] = useState(profile.alias);
    const [pin, setPin] = useState(profile.pin);
    const [goal, setGoal] = useState(profile.goal);
    const isDirty = alias !== profile.alias || pin !== profile.pin || goal !== profile.goal;
    const isValid = alias.trim().length >= 2 && pin.length === 4;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid || !isDirty) return;
        onUpdate({ alias: alias.trim(), pin, goal });
    };

    return (
        <div className="profile-grid">
            <div className="profile-hero" style={{ borderColor: profile.avatarColor }}>
                <div className="profile-avatar" style={{ background: profile.avatarColor }}>
                    {profile.alias.slice(0, 2).toUpperCase()}
                </div>
                <div>
                    <p className="chip">Perfil activo</p>
                    <h2>{profile.alias}</h2>
                    <p>Objetivo actual: {profile.goal ? profile.goal : 'Sin definir'}</p>
                </div>
            </div>

            <div className="profile-card">
                <h4>Datos de acceso</h4>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <label>
                        <span>Alias</span>
                        <input value={alias} onChange={(e) => setAlias(e.target.value)} />
                    </label>
                    <label>
                        <span>PIN</span>
                        <input
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </label>
                    <div className="goal-selector">
                        <span>Objetivo</span>
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
                    <button className="cta-primary" disabled={!isDirty || !isValid}>
                        Guardar cambios
                    </button>
                </form>
            </div>

            <div className="profile-card danger-card">
                <h4>Seguridad</h4>
                <p>Salir de tu cuenta eliminará los datos locales del dispositivo.</p>
                <button className="cta-danger" type="button" onClick={onLogout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default ProfileView;
