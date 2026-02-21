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
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const isDirty = alias !== profile.alias || pin !== profile.pin || goal !== profile.goal;
    const isValid = alias.trim().length >= 2 && pin.length === 4;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid || !isDirty) return;
        onUpdate({ alias: alias.trim(), pin, goal });
    };

    const handleLogout = () => {
        onLogout();
        setShowLogoutConfirm(false);
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
            <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="cta-danger"
                style={{ justifySelf: 'stretch', marginTop: 'var(--spacing-md)', width: '100%' }}
            >
                Cerrar sesión
            </button>
            {showLogoutConfirm && (
                <div style={overlayStyle}>
                    <div className="glass animate-fade-scale" style={modalStyle}>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>¿Cerrar sesión?</h3>
                        <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-muted)' }}>
                            Solo cerrarás sesión en este dispositivo; toda tu información seguirá protegida en la nube.
                        </p>
                        <div className="flex gap-sm" style={{ justifyContent: 'flex-end' }}>
                            <button type="button" className="cta-ghost" onClick={() => setShowLogoutConfirm(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="cta-danger" onClick={handleLogout}>
                                Sí, cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 'var(--spacing-lg)'
};

const modalStyle: React.CSSProperties = {
    width: 'min(420px, 100%)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xl)',
    border: `1px solid var(--border)`
};

export default ProfileView;
