import { useState, useEffect, useCallback } from 'react';
import type { WeightLog } from '../types';
import { addRemoteWeightLog, deleteRemoteWeightLog, fetchWeightLogs } from '../services/weightService';

export const useWeightLogs = (userId?: string) => {
    const [logs, setLogs] = useState<WeightLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            setLogs([]);
            setError('Debes iniciar sesión para registrar tu peso.');
            return;
        }
        let cancelled = false;

        (async () => {
            setLoading(true);
            const remoteLogs = await fetchWeightLogs(userId);
            if (!cancelled) {
                setLogs(remoteLogs);
                setError(null);
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    const addLog = useCallback(async (weight: number) => {
        if (!weight || !userId) {
            setError('Completa tu perfil antes de registrar peso.');
            return;
        }

        setLoading(true);
        setError(null);
        const remote = await addRemoteWeightLog(userId, weight);
        if (remote) {
            setLogs(prev => [remote, ...prev.filter(log => log.id !== remote.id)]);
        } else {
            setError('No se pudo guardar el peso. Revisa tu conexión o permisos.');
        }
        setLoading(false);
    }, [userId]);

    const deleteLog = useCallback(async (weightId: string) => {
        if (!userId) {
            setError('Debes iniciar sesión para eliminar registros.');
            return;
        }

        setLoading(true);
        setError(null);
        const success = await deleteRemoteWeightLog(userId, weightId);
        if (success) {
            setLogs(prev => prev.filter(log => log.id !== weightId));
        } else {
            setError('No se pudo eliminar el peso. Intenta nuevamente.');
        }
        setLoading(false);
    }, [userId]);

    return {
        logs,
        latest: logs[0] ?? null,
        addLog,
        deleteLog,
        loading,
        error
    };
};
