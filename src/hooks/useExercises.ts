import { useState, useEffect } from 'react';
import type { Exercise } from '../types';
import { fetchAllExercises } from '../services/exerciseService';

export function useExercises() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoading(true);
            const result = await fetchAllExercises();
            
            if (!cancelled) {
                if (result.success) {
                    setExercises(result.data || []);
                    setError(null);
                } else {
                    setError(result.error || 'No se pudieron cargar los ejercicios.');
                }
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return { exercises, loading, error };
}
