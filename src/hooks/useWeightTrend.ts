import { useMemo } from 'react';
import type { WeightLog } from '../types';

export type WeightTrend = {
    direction: 'up' | 'down' | 'flat';
    delta: number;
    latest: number | null;
    previous: number | null;
};

export const useWeightTrend = (logs: WeightLog[]): WeightTrend => {
    return useMemo(() => {
        if (logs.length < 2) {
            const latest = logs[0]?.weight ?? null;
            return { direction: 'flat', delta: 0, latest, previous: null };
        }

        const [recent, prev] = logs;
        const delta = Number((recent.weight - prev.weight).toFixed(1));
        const direction = delta === 0 ? 'flat' : delta > 0 ? 'up' : 'down';

        return {
            direction,
            delta,
            latest: recent.weight,
            previous: prev.weight
        };
    }, [logs]);
};
