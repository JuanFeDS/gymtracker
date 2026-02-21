import { useCallback, useEffect, useState } from 'react';
import type { CompletedSession } from '../types';
import { loadJSON, saveJSON } from '../utils/storage';
import { fetchRemoteSessions } from '../services/sessionService';

const STORAGE_KEY = 'sessionHistory';

export const useSessionHistory = (userId?: string) => {
    const [sessions, setSessions] = useState<CompletedSession[]>(() =>
        loadJSON<CompletedSession[]>(STORAGE_KEY, [])
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        saveJSON(STORAGE_KEY, sessions);
    }, [sessions]);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;

        (async () => {
            setLoading(true);
            const remote = await fetchRemoteSessions(userId);
            if (!cancelled) {
                setSessions(remote);
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const addSession = useCallback((completed: CompletedSession) => {
        setSessions(prev => [completed, ...prev.filter(session => session.id !== completed.id)]);
    }, []);

    return {
        sessions,
        addSession,
        loading
    };
};
