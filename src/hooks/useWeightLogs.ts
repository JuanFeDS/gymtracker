import { useState, useEffect, useCallback } from 'react';
import type { WeightLog } from '../types';
import { loadJSON, saveJSON } from '../utils/storage';
import { generateId } from '../utils/id';
import { addRemoteWeightLog, fetchWeightLogs } from '../services/weightService';

const STORAGE_KEY = 'weightLogs';

export const useWeightLogs = (userId?: string) => {
    const [logs, setLogs] = useState<WeightLog[]>(() =>
        loadJSON<WeightLog[]>(STORAGE_KEY, [])
    );
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        saveJSON(STORAGE_KEY, logs);
    }, [logs]);

    useEffect(() => {
        if (!userId) return;
        let cancelled = false;

        (async () => {
            setLoading(true);
            const remoteLogs = await fetchWeightLogs(userId);
            if (!cancelled) {
                setLogs(remoteLogs);
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const addLog = useCallback(async (weight: number) => {
        if (!weight) return;

        if (!userId) {
            const entry: WeightLog = {
                id: generateId(),
                date: new Date().toISOString().slice(0, 10),
                weight
            };
            setLogs(prev => [entry, ...prev]);
            return;
        }

        setLoading(true);
        const remote = await addRemoteWeightLog(userId, weight);
        if (remote) {
            setLogs(prev => [remote, ...prev.filter(log => log.id !== remote.id)]);
        }
        setLoading(false);
    }, [userId]);

    return {
        logs,
        latest: logs[0] ?? null,
        addLog,
        loading
    };
};
