import type { WeightLog } from '../types';
import type { ServiceResult } from '../types/service';
import { generateId } from '../utils/id';
import { supabase } from './supabaseClient';

const mapRowToWeight = (row: Record<string, unknown>): WeightLog => ({
    id: row.weight_id as string,
    date: row.recorded_at as string,
    weight: Number(row.weight_kg)
});

export async function fetchWeightLogs(userId: string): Promise<ServiceResult<WeightLog[]>> {
    const { data, error } = await supabase
        .from('weights')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false });

    if (error) {
        console.error('Error al obtener pesos desde Supabase:', error.message);
        return { success: false, error: 'No se pudieron cargar los registros de peso.', data: [] };
    }

    return { success: true, data: (data ?? []).map(mapRowToWeight) };
}

export async function addRemoteWeightLog(userId: string, weight: number): Promise<ServiceResult<WeightLog>> {
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
        return { success: false, error: 'No se pudo guardar el peso. Intenta nuevamente.' };
    }

    return { success: true, data: mapRowToWeight(data) };
}

export async function deleteRemoteWeightLog(userId: string, weightId: string): Promise<ServiceResult<boolean>> {
    const { error } = await supabase
        .from('weights')
        .delete()
        .eq('user_id', userId)
        .eq('weight_id', weightId);

    if (error) {
        console.error('Error al eliminar peso en Supabase:', error.message);
        return { success: false, error: 'No se pudo eliminar el registro.' };
    }

    return { success: true, data: true };
}
