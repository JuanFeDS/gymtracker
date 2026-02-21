import { useCallback, useEffect, useState } from 'react';
import type { GamificationStats } from '../types';
import { loadJSON, saveJSON } from '../utils/storage';

const STORAGE_KEY = 'gamificationStats';

const DEFAULT_STATS: GamificationStats = {
    xp: 240,
    level: 1,
    nextLevelXp: 500,
    streakDays: 2,
    missions: [
        { id: 'sessions-3', title: 'Completa 3 sesiones', description: 'Termina tres entrenamientos esta semana.', progress: 1, goal: 3, rewardXp: 150 },
        { id: 'log-weight', title: 'Registra tu peso', description: 'Añade 5 registros de peso en el mes.', progress: 2, goal: 5, rewardXp: 80 },
        { id: 'consistency', title: 'Streak de 5 días', description: 'Entrena 5 días seguidos.', progress: 2, goal: 5, rewardXp: 200 }
    ]
};

const withLevelData = (stats: GamificationStats): GamificationStats => {
    const level = Math.max(1, Math.floor(stats.xp / 500) + 1);
    const nextLevelXp = level * 500;
    return { ...stats, level, nextLevelXp };
};

export const useGamificationStats = () => {
    const [stats, setStats] = useState<GamificationStats>(() =>
        withLevelData(loadJSON<GamificationStats>(STORAGE_KEY, DEFAULT_STATS))
    );

    useEffect(() => {
        saveJSON(STORAGE_KEY, stats);
    }, [stats]);

    const awardXp = useCallback((amount: number) => {
        if (!amount) return;
        setStats(prev => withLevelData({ ...prev, xp: prev.xp + amount }));
    }, []);

    const incrementStreak = useCallback(() => {
        setStats(prev => ({ ...prev, streakDays: prev.streakDays + 1 }));
    }, []);

    const updateMissionProgress = useCallback((missionId: string, delta: number) => {
        setStats(prev => ({
            ...prev,
            missions: prev.missions.map(m =>
                m.id === missionId ? { ...m, progress: Math.min(m.goal, m.progress + delta) } : m
            )
        }));
    }, []);

    return {
        stats,
        awardXp,
        incrementStreak,
        updateMissionProgress
    };
};
