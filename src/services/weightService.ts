import type { WeightLog } from '../types';
import { generateId } from '../utils/id';
import { supabase } from './supabaseClient';

const mapRowToWeight = (row: any): WeightLog => ({
    id: row.weight_id,
    date: row.recorded_at,
    weight: Number(row.weight_kg)
});

export async function fetchWeightLogs(userId: string): Promise<WeightLog[]> {
    const { data, error } = await supabase
        .from('weights')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });

    if (error) {
        console.error('Error al obtener pesos desde Supabase:', error.message);
        return [];
    }

    return (data ?? []).map(mapRowToWeight);
}

export async function addRemoteWeightLog(userId: string, weight: number): Promise<WeightLog | null> {
    const { data, error } = await supabase
        .from('weights')
        .insert({
            weight_id: generateId(),
            user_id: userId,
            recorded_at: new Date().toISOString().slice(0, 10),
            weight_kg: weight
        })
        .select('*')
        .single();

    if (error) {
        console.error('Error al registrar peso en Supabase:', error.message);
        return null;
    }

    return mapRowToWeight(data);
}

export async function deleteRemoteWeightLog(userId: string, weightId: string): Promise<boolean> {
    const { error } = await supabase
        .from('weights')
        .delete()
        .eq('user_id', userId)
        .eq('weight_id', weightId);

    if (error) {
        console.error('Error al eliminar peso en Supabase:', error.message);
        return false;
    }

    return true;
}
