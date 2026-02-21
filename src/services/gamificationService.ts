import type { GamificationMission, GamificationStats } from '../types';
import { supabase } from './supabaseClient';

const LEVEL_STEP = 500;

const computeLevelData = (xp: number) => {
    const level = Math.max(1, Math.floor(xp / LEVEL_STEP) + 1);
    const nextLevelXp = level * LEVEL_STEP;
    return { level, nextLevelXp };
};

const mapMission = (row: any): GamificationMission => ({
    id: row?.mission?.mission_id ?? row.user_mission_id,
    title: row?.mission?.title ?? 'Misión',
    description: row?.mission?.description ?? '',
    progress: Number(row?.progress ?? 0),
    goal: Number(row?.mission?.goal_value ?? 1) || 1,
    rewardXp: Number(row?.mission?.reward_xp ?? 0)
});

const calculateXp = (rows: any[]) => rows.reduce((acc, row) => {
    const completed = Boolean(row?.completed);
    const reward = Number(row?.mission?.reward_xp ?? 0);
    return acc + (completed ? reward : 0);
}, 0);

const fetchStreakDays = async (userId: string): Promise<number> => {
    const { data, error } = await supabase
        .from('sessions')
        .select('ended_at')
        .eq('user_id', userId)
        .order('ended_at', { ascending: false })
        .limit(30);

    if (error || !data) {
        if (error) {
            console.error('Error al obtener sesiones para la racha:', error.message);
        }
        return 0;
    }

    const daySet = new Set(
        data
            .map(row => row.ended_at ? new Date(row.ended_at).toISOString().slice(0, 10) : null)
            .filter(Boolean) as string[]
    );

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    while (daySet.has(cursor.toISOString().slice(0, 10))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
};

export const fetchGamificationSnapshot = async (userId: string): Promise<GamificationStats> => {
    const [{ data, error }, streakDays] = await Promise.all([
        supabase
            .from('user_missions')
            .select(`
                user_mission_id,
                progress,
                completed,
                mission:missions (
                    mission_id,
                    title,
                    description,
                    reward_xp,
                    goal_value
                )
            `)
            .eq('user_id', userId),
        fetchStreakDays(userId)
    ]);

    if (error || !data) {
        if (error) {
            console.error('Error al obtener misiones de Supabase:', error.message);
        }
        return {
            xp: 0,
            level: 1,
            nextLevelXp: LEVEL_STEP,
            streakDays,
            missions: []
        };
    }

    const xp = calculateXp(data);
    const { level, nextLevelXp } = computeLevelData(xp);

    return {
        xp,
        level,
        nextLevelXp,
        streakDays,
        missions: data.map(mapMission)
    };
};
