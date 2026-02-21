import type { CompletedSession, SessionMetrics, WorkoutSession } from '../types';

const getVolume = (reps: number, weight: number) => reps * weight;

export const calculateSessionMetrics = (session: WorkoutSession, endTime?: number): SessionMetrics => {
    const totalSets = session.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
    const totalVolume = session.exercises.reduce(
        (acc, exercise) => acc + exercise.sets.reduce((sum, set) => sum + getVolume(set.reps, set.weight), 0),
        0
    );

    const durationMinutes = Math.max(1, Math.floor(((endTime ?? Date.now()) - session.startTime) / 60000));

    return {
        totalSets,
        totalVolume,
        durationMinutes
    };
};

export const finalizeSession = (session: WorkoutSession): CompletedSession => {
    const endTime = Date.now();
    const metrics = calculateSessionMetrics(session, endTime);

    return {
        ...session,
        endTime,
        metrics
    };
};
