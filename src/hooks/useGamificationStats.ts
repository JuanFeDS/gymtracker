import { useEffect, useState } from 'react';
import type { GamificationStats } from '../types';
import { fetchGamificationSnapshot } from '../services/gamificationService';
import { assignInitialMissions } from '../services/missionService';

const DEFAULT_STATS: GamificationStats = {
    xp: 0,
    level: 1,
    nextLevelXp: 500,
    streakDays: 0,
    missions: []
};

export const useGamificationStats = (userId?: string) => {
    const [stats, setStats] = useState<GamificationStats>(DEFAULT_STATS);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;

        (async () => {
            setLoading(true);
            await assignInitialMissions(userId);
            const snapshot = await fetchGamificationSnapshot(userId);
            if (!cancelled) {
                setStats(snapshot);
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    return {
        stats,
        loading
    };
};
