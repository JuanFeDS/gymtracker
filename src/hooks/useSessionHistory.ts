import { useCallback, useEffect, useState } from 'react';
import type { CompletedSession } from '../types';
import { loadJSON, saveJSON } from '../utils/storage';

const STORAGE_KEY = 'sessionHistory';

export const useSessionHistory = () => {
    const [sessions, setSessions] = useState<CompletedSession[]>(() =>
        loadJSON<CompletedSession[]>(STORAGE_KEY, [])
    );

    useEffect(() => {
        saveJSON(STORAGE_KEY, sessions);
    }, [sessions]);

    const addSession = useCallback((completed: CompletedSession) => {
        setSessions(prev => [completed, ...prev]);
    }, []);

    return {
        sessions,
        addSession
    };
};
