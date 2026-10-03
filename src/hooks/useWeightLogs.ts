import { useState, useEffect, useCallback } from 'react';
import type { WeightLog } from '../types';
import { addRemoteWeightLog, deleteRemoteWeightLog, fetchWeightLogs } from '../services/weightService';

export const useWeightLogs = (userId?: string) => {
    const [logs, setLogs] = useState<WeightLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) {
            return;
        }
        let cancelled = false;

        (async () => {
            setLoading(true);
            const result = await fetchWeightLogs(userId);
            if (!cancelled) {
                if (result.success) {
                    setLogs(result.data || []);
                    setError(null);
                } else {
                    setError(result.error || 'No se pudieron cargar los registros.');
                }
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
        const result = await addRemoteWeightLog(userId, weight);
        if (result.success && result.data) {
            setLogs(prev => [result.data!, ...prev.filter(log => log.id !== result.data!.id)]);
        } else {
            setError(result.error || 'No se pudo guardar el peso. Revisa tu conexión o permisos.');
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
        const result = await deleteRemoteWeightLog(userId, weightId);
        if (result.success) {
            setLogs(prev => prev.filter(log => log.id !== weightId));
        } else {
            setError(result.error || 'No se pudo eliminar el peso. Intenta nuevamente.');
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
