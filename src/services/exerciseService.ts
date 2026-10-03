import type { Exercise } from '../types';
import type { ServiceResult } from '../types/service';
import { supabase } from './supabaseClient';

const mapRowToExercise = (row: Record<string, unknown>): Exercise => ({
    id: row.exercise_id as string,
    name: row.exercise_name as string,
    category: row.category as string,
    image: `${import.meta.env.BASE_URL}exercise-images/${row.exercise_id}.jpg`,
    muscleGroup: row.muscle_group as string,
    equipment: row.equipment as string,
    difficulty: row.difficulty as string
});

export async function fetchAllExercises(): Promise<ServiceResult<Exercise[]>> {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('exercise_name', { ascending: true });

    if (error) {
        console.error('Error al obtener ejercicios desde Supabase:', error.message);
        return { success: false, error: 'No se pudieron cargar los ejercicios.', data: [] };
    }

    return { success: true, data: (data ?? []).map(mapRowToExercise) };
}

export async function fetchExercisesByCategory(category: string): Promise<ServiceResult<Exercise[]>> {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('category', category)
        .order('exercise_name', { ascending: true });

    if (error) {
        console.error('Error al filtrar ejercicios por categoría:', error.message);
        return { success: false, error: 'No se pudieron cargar los ejercicios.', data: [] };
    }

    return { success: true, data: (data ?? []).map(mapRowToExercise) };
}

export async function searchExercises(query: string): Promise<ServiceResult<Exercise[]>> {
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .ilike('exercise_name', `%${query}%`)
        .order('exercise_name', { ascending: true });

    if (error) {
        console.error('Error al buscar ejercicios:', error.message);
        return { success: false, error: 'No se pudieron buscar los ejercicios.', data: [] };
    }

    return { success: true, data: (data ?? []).map(mapRowToExercise) };
}
