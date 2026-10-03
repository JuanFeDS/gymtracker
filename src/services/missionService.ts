import type { CompletedSession } from '../types';
import { supabase } from './supabaseClient';

export async function assignInitialMissions(userId: string): Promise<void> {
    const { data: existingMissions } = await supabase
        .from('user_missions')
        .select('mission_id')
        .eq('user_id', userId);

    if (existingMissions && existingMissions.length > 0) {
        return;
    }

    const { data: allMissions } = await supabase
        .from('missions')
        .select('mission_id');

    if (!allMissions || allMissions.length === 0) return;

    const userMissions = allMissions.map(mission => ({
        user_id: userId,
        mission_id: mission.mission_id,
        progress: 0,
        completed: false
    }));

    await supabase.from('user_missions').insert(userMissions);
}

interface CompletedMissionInfo {
    mission_id: string;
    title: string;
    reward_xp: number;
    description: string;
}

export async function updateMissionProgress(userId: string, session: CompletedSession): Promise<CompletedMissionInfo[]> {
    const { data: userMissions } = await supabase
        .from('user_missions')
        .select(`
            user_mission_id,
            mission_id,
            progress,
            completed,
            mission:missions (
                title,
                description,
                mission_type,
                goal_value,
                reward_xp
            )
        `)
        .eq('user_id', userId)
        .eq('completed', false);

    if (!userMissions || userMissions.length === 0) return [];

    const { data: allSessions } = await supabase
        .from('sessions')
        .select('total_sets, total_volume, duration_min, ended_at')
        .eq('user_id', userId);

    const { data: weightLogs } = await supabase
        .from('weights')
        .select('weight_kg, recorded_at')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: true });

    const totalSessions = (allSessions?.length || 0);
    const totalVolume = allSessions?.reduce((acc, s) => acc + Number(s.total_volume || 0), 0) || 0;
    const totalSets = allSessions?.reduce((acc, s) => acc + Number(s.total_sets || 0), 0) || 0;

    const streakDays = calculateStreak(allSessions?.map(s => s.ended_at) || []);
    const weightChange = calculateWeightChange(weightLogs || []);
    const weightLogCount = weightLogs?.length || 0;

    const newlyCompleted: CompletedMissionInfo[] = [];

    const updates = userMissions.map(um => {
        const mission = um.mission as any;
        const missionType = mission?.mission_type;
        const goalValue = Number(mission?.goal_value || 0);
        let newProgress = Number(um.progress || 0);

        switch (missionType) {
            case 'session_count':
                newProgress = totalSessions;
                break;
            case 'total_volume':
                newProgress = totalVolume;
                break;
            case 'total_sets':
                newProgress = totalSets;
                break;
            case 'streak_days':
                newProgress = streakDays;
                break;
            case 'session_duration':
                newProgress = Math.max(newProgress, session.metrics?.durationMinutes || 0);
                break;
            case 'weight_logs':
                newProgress = weightLogCount;
                break;
            case 'weight_change':
                newProgress = weightChange;
                break;
            default:
                break;
        }

        const isCompleted = newProgress >= goalValue;
        const wasJustCompleted = isCompleted && !um.completed;

        if (wasJustCompleted) {
            newlyCompleted.push({
                mission_id: um.mission_id,
                title: mission?.title || 'Misión',
                reward_xp: mission?.reward_xp || 0,
                description: mission?.description || ''
            });
        }

        return {
            user_mission_id: um.user_mission_id,
            progress: newProgress,
            completed: isCompleted,
            completed_at: wasJustCompleted ? new Date().toISOString() : null
        };
    });

    for (const update of updates) {
        await supabase
            .from('user_missions')
            .update({
                progress: update.progress,
                completed: update.completed,
                completed_at: update.completed_at,
                updated_at: new Date().toISOString()
            })
            .eq('user_mission_id', update.user_mission_id);
    }

    return newlyCompleted;
}

function calculateStreak(sessionDates: (string | null)[]): number {
    const uniqueDates = new Set(
        sessionDates
            .filter(Boolean)
            .map(date => new Date(date!).toISOString().slice(0, 10))
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (uniqueDates.has(today.toISOString().slice(0, 10))) {
        streak++;
        today.setDate(today.getDate() - 1);
    }

    return streak;
}

function calculateWeightChange(logs: Array<{ weight_kg: number; recorded_at: string }>): number {
    if (logs.length < 2) return 0;
    const first = Number(logs[0].weight_kg);
    const last = Number(logs[logs.length - 1].weight_kg);
    return Math.abs(last - first);
}
