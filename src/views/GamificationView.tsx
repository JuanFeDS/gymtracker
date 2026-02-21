import type { GamificationStats } from '../types';

interface GamificationViewProps {
    stats: GamificationStats;
}

const GamificationView: React.FC<GamificationViewProps> = ({ stats }) => {
    const xpProgress = Math.min(100, Math.round((stats.xp / stats.nextLevelXp) * 100));

    return (
        <div className="gamification-grid">
            <div className="gamification-hero">
                <div className="streak-pill">
                    <div className="streak-icon">🔥</div>
                    <div>
                        <p className="chip">Racha actual</p>
                        <h3>{stats.streakDays} días</h3>
                        <span>Mantén el ritmo para recompensas extra.</span>
                    </div>
                </div>
                <button className="cta-ghost">Ver recompensas</button>
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
                <button className="cta-primary">Ver desafíos</button>
            </div>

            <div className="mission-section">
                <h4>Misiones activas</h4>
                <div className="mission-grid">
                    {stats.missions.map(mission => {
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
