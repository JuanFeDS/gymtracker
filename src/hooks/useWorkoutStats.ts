import { useMemo } from 'react';
import type { WorkoutSession } from '../types';

const getSetVolume = (reps: number, weight: number) => reps * weight;

export type WorkoutStats = {
    totalSets: number;
    totalVolume: number;
    exerciseCount: number;
    durationMinutes: number;
};

export const useWorkoutStats = (session: WorkoutSession | null): WorkoutStats => {
    return useMemo(() => {
        if (!session) {
            return {
                totalSets: 0,
                totalVolume: 0,
                exerciseCount: 0,
                durationMinutes: 0
            };
        }

        const now = Date.now();
        const duration = Math.max(1, Math.floor((now - session.startTime) / 60000));

        const { totalSets, totalVolume } = session.exercises.reduce((acc, exercise) => {
            acc.totalSets += exercise.sets.length;
            acc.totalVolume += exercise.sets.reduce((sum, set) => sum + getSetVolume(set.reps, set.weight), 0);
            return acc;
        }, { totalSets: 0, totalVolume: 0 });

        return {
            totalSets,
            totalVolume,
            exerciseCount: session.exercises.length,
            durationMinutes: duration
        };
    }, [session]);
};
