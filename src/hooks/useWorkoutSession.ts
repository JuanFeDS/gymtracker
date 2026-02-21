import { useState, useEffect, useCallback } from 'react';
import type { CompletedSession, WorkoutSession } from '../types';
import { loadJSON, saveJSON, removeKey } from '../utils/storage';
import { generateId } from '../utils/id';
import { finalizeSession } from '../utils/sessionMetrics';

const STORAGE_KEY = 'activeSession';

export const useWorkoutSession = (onComplete?: (session: CompletedSession) => void) => {
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
        setSession(prev => {
            if (!prev) return null;
            const completed = finalizeSession(prev);
            onComplete?.(completed);
            return null;
        });
    }, [onComplete]);

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
