import { useState, useEffect, useCallback } from 'react';
import type { WeightLog } from '../types';
import { loadJSON, saveJSON } from '../utils/storage';
import { generateId } from '../utils/id';

const STORAGE_KEY = 'weightLogs';

export const useWeightLogs = () => {
    const [logs, setLogs] = useState<WeightLog[]>(() =>
        loadJSON<WeightLog[]>(STORAGE_KEY, [])
    );

    useEffect(() => {
        saveJSON(STORAGE_KEY, logs);
    }, [logs]);

    const addLog = useCallback((weight: number) => {
        if (!weight) return;
        const entry: WeightLog = {
            id: generateId(),
            date: new Date().toLocaleDateString(),
            weight
        };

        setLogs(prev => [entry, ...prev]);
    }, []);

    return {
        logs,
        latest: logs[0] ?? null,
        addLog
    };
};
