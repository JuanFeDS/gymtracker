import { useState, useEffect, useCallback } from 'react';
import type { WorkoutSession } from '../types';
import { loadJSON, saveJSON, removeKey } from '../utils/storage';
import { generateId } from '../utils/id';

const STORAGE_KEY = 'activeSession';

export const useWorkoutSession = () => {
    const [session, setSession] = useState<WorkoutSession | null>(() =>
        loadJSON<WorkoutSession | null>(STORAGE_KEY, null)
    );

    useEffect(() => {
        if (session) {
            saveJSON(STORAGE_KEY, session);
        } else {
            removeKey(STORAGE_KEY);
        }
    }, [session]);

    const startSession = useCallback(() => {
        setSession({
            id: generateId(),
            startTime: Date.now(),
            exercises: []
        });
    }, []);

    const finishSession = useCallback(() => {
        setSession(null);
    }, []);

    const updateSession = useCallback((next: WorkoutSession) => {
        setSession(next);
    }, []);

    return {
        session,
        hasActiveSession: Boolean(session),
        startSession,
        finishSession,
        updateSession
    };
};
