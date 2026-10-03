import type { CompletedSession, LoggedExercise, SetLog } from '../types';
import { supabase } from './supabaseClient';

const toISO = (timestamp: number) => new Date(timestamp).toISOString();

const rehydrateExercise = (row: Record<string, unknown>): LoggedExercise => {
    const setsDetail = row.sets_detail as Array<Record<string, unknown>> | undefined;
    
    const sets: SetLog[] = (setsDetail ?? []).map((set, idx) => ({
        id: set.id as string || `${row.session_exercise_id}-set-${idx}`,
        reps: Number(set.reps ?? 0),
        weight: Number(set.weight ?? 0),
        rpe: set.rpe ? Number(set.rpe) : undefined,
        completed: Boolean(set.completed ?? true)
    }));

    return {
        id: (row.session_exercise_id || row.id) as string,
        exerciseId: (row.exercise_id as string) ?? '',
        name: (row.exercise_name as string) ?? 'Ejercicio',
        sets: sets.length > 0 ? sets : [{ id: 'default', reps: 0, weight: 0, completed: false }]
    };
};

const buildCompletedSession = (sessionRow: Record<string, unknown>, exercises: LoggedExercise[]): CompletedSession => {
    const start = sessionRow.started_at ? new Date(sessionRow.started_at as string).getTime() : Date.now();
    const end = sessionRow.ended_at ? new Date(sessionRow.ended_at as string).getTime() : start;

    return {
        id: sessionRow.session_id as string,
        startTime: start,
        endTime: end,
        exercises,
        metrics: {
            totalSets: Number(sessionRow.total_sets ?? 0),
            totalVolume: Number(sessionRow.total_volume ?? 0),
            durationMinutes: Number(sessionRow.duration_min ?? 0) || Math.max(1, Math.floor((end - start) / 60000))
        }
    };
};

export async function fetchRemoteSessions(userId: string): Promise<CompletedSession[]> {
    const { data: sessionRows, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al obtener sesiones desde Supabase:', error.message);
        return [];
    }

    const ids = (sessionRows ?? []).map(row => row.session_id);
    if (!ids.length) return [];

    const { data: exerciseRows, error: exercisesError } = await supabase
        .from('session_exercises')
        .select('*')
        .in('session_id', ids);

    if (exercisesError) {
        console.error('Error al obtener ejercicios de sesión:', exercisesError.message);
    }

    const grouped = new Map<string, LoggedExercise[]>();
    (exerciseRows ?? []).forEach(row => {
        const sessId = row.session_id;
        const arr = grouped.get(sessId) ?? [];
        arr.push(rehydrateExercise(row));
        grouped.set(sessId, arr);
    });

    return (sessionRows ?? []).map(row => buildCompletedSession(row, grouped.get(row.session_id) ?? []));
}

const summarizeExercise = (sessionId: string, exercise: LoggedExercise, index: number) => {
    const setsDetail = exercise.sets.map(set => ({
        id: set.id,
        reps: set.reps,
        weight: set.weight,
        completed: set.completed,
        rpe: set.rpe
    }));

    return {
        session_id: sessionId,
        exercise_id: exercise.exerciseId || null,
        exercise_name: exercise.name,
        category: null,
        sets_detail: setsDetail,
        order_index: index
    };
};

export async function saveCompletedSession(userId: string, session: CompletedSession): Promise<void> {
    const basePayload = {
        session_id: session.id,
        user_id: userId,
        started_at: toISO(session.startTime),
        ended_at: toISO(session.endTime),
        total_sets: session.metrics?.totalSets ?? 0,
        total_volume: session.metrics?.totalVolume ?? 0,
        duration_min: session.metrics?.durationMinutes ?? 0,
        notes: null,
        created_at: new Date(session.endTime).toISOString().slice(0, 10)
    };

    const { error } = await supabase.from('sessions').upsert(basePayload, { onConflict: 'session_id' });
    if (error) {
        console.error('Error al guardar sesión en Supabase:', error.message);
        return;
    }

    if (!session.exercises.length) return;

    const { error: deleteError } = await supabase
        .from('session_exercises')
        .delete()
        .eq('session_id', session.id);

    if (deleteError) {
        console.error('Error al eliminar ejercicios previos:', deleteError.message);
    }

    const exerciseRows = session.exercises.map((exercise, index) =>
        summarizeExercise(session.id, exercise, index)
    );

    const { error: exerciseError } = await supabase.from('session_exercises').insert(exerciseRows);
    if (exerciseError) {
        console.error('Error al guardar ejercicios de la sesión:', exerciseError.message);
    }
}
