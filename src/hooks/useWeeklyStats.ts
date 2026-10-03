import { useMemo } from 'react';
import type { CompletedSession } from '../types';

export interface WeeklyStats {
    weeklySets: number;
    weeklyVolume: number;
    weeklySessionCount: number;
}

export const useWeeklyStats = (sessions: CompletedSession[]): WeeklyStats => {
    return useMemo(() => {
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        
        const recentSessions = sessions.filter(session => {
            const sessionTime = new Date(session.endTime).getTime();
            return sessionTime >= oneWeekAgo;
        });

        const weeklySets = recentSessions.reduce((acc, session) => {
            return acc + (session.metrics?.totalSets ?? 0);
        }, 0);

        const weeklyVolume = recentSessions.reduce((acc, session) => {
            return acc + (session.metrics?.totalVolume ?? 0);
        }, 0);

        return {
            weeklySets,
            weeklyVolume,
            weeklySessionCount: recentSessions.length
        };
    }, [sessions]);
};
