import { useState } from 'react';
import type { GamificationStats } from '../types';

interface GamificationViewProps {
    stats: GamificationStats;
    loading?: boolean;
}

const GamificationView: React.FC<GamificationViewProps> = ({ stats, loading = false }) => {
    const [showAllMissions, setShowAllMissions] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const xpProgress = Math.min(100, Math.round((stats.xp / stats.nextLevelXp) * 100));

    const activeMissions = stats.missions.filter(m => m.progress < m.goal);
    const completedMissions = stats.missions.filter(m => m.progress >= m.goal);
    
    const displayedMissions = showAllMissions 
        ? (activeTab === 'active' ? activeMissions : completedMissions)
        : activeMissions.slice(0, 3);

    return (
        <div className="gamification-grid">
            {loading && (
                <div className="glass" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <p>Cargando progreso...</p>
                </div>
            )}
            <div className="gamification-hero">
                <div className="streak-pill">
                    <div className="streak-icon">🔥</div>
                    <div>
                        <p className="chip">Racha actual</p>
                        <h3>{stats.streakDays} días</h3>
                        <span>Mantén el ritmo para recompensas extra.</span>
                    </div>
                </div>
                <button 
                    className="cta-ghost"
                    onClick={() => {
                        setActiveTab('completed');
                        setShowAllMissions(true);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    Ver recompensas
                </button>
            </div>

            <div className="glass gamification-card">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="chip">Nivel {stats.level}</p>
                        <h3 style={{ fontSize: '1.75rem' }}>{stats.xp} XP</h3>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stats.xp} / {stats.nextLevelXp} XP</span>
                </div>
                <div className="xp-shell">
                    <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {stats.nextLevelXp - stats.xp} XP para alcanzar el siguiente nivel.
                </p>
            </div>

            <div className="glass gamification-card reward-card">
                <p className="chip">Meta semanal</p>
                <h4>Bonus de consistencia</h4>
                <p>Completa 4 sesiones esta semana para duplicar tu XP.</p>
                <button 
                    className="cta-primary"
                    onClick={() => {
                        setActiveTab('active');
                        setShowAllMissions(true);
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    Ver desafíos
                </button>
            </div>

            <div className="mission-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                    <h4>Misiones {activeTab === 'active' ? 'activas' : 'completadas'}</h4>
                    {!showAllMissions && activeMissions.length > 3 && (
                        <button
                            onClick={() => setShowAllMissions(true)}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--primary)',
                                color: 'var(--primary)',
                                padding: '6px 16px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(64, 224, 208, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            Ver todas ({activeMissions.length})
                        </button>
                    )}
                </div>
                
                {showAllMissions && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--spacing-md)' }}>
                        <button
                            onClick={() => setActiveTab('active')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                background: activeTab === 'active' ? 'var(--primary)' : 'var(--surface-hover)',
                                color: activeTab === 'active' ? 'black' : 'var(--text-muted)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Activas ({activeMissions.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            style={{
                                flex: 1,
                                padding: '8px',
                                background: activeTab === 'completed' ? 'var(--primary)' : 'var(--surface-hover)',
                                color: activeTab === 'completed' ? 'black' : 'var(--text-muted)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Completadas ({completedMissions.length})
                        </button>
                    </div>
                )}
                
                <div className="mission-grid">
                    {displayedMissions.map(mission => {
                        const missionProgress = Math.min(100, Math.round((mission.progress / mission.goal) * 100));
                        const completed = mission.progress >= mission.goal;
                        return (
                            <div key={mission.id} className={`mission-card ${completed ? 'mission-card--done' : ''}`}>
                                <div>
                                    <p className="chip">+{mission.rewardXp} XP</p>
                                    <h5>{mission.title}</h5>
                                    <p className="mission-description">{mission.description}</p>
                                </div>
                                <div className="mission-progress">
                                    <div className="xp-shell">
                                        <div className="xp-fill" style={{ width: `${missionProgress}%` }} />
                                    </div>
                                    <span className="mission-meta">
                                        {mission.progress}/{mission.goal} {completed ? 'Completado' : 'Progreso'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GamificationView;
