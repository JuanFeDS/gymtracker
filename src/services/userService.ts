import type { UserProfile } from '../types';
import type { ServiceResult } from '../types/service';
import { supabase } from './supabaseClient';

const today = () => new Date().toISOString().slice(0, 10);

const normalizeGoal = (goal?: string | null): UserProfile['goal'] => {
    if (!goal) return undefined;
    const allowed = ['fuerza', 'hipertrofia', 'resistencia'] as const;
    return allowed.includes(goal as typeof allowed[number]) ? goal as UserProfile['goal'] : undefined;
};

const mapRowToProfile = (row: Record<string, unknown>): UserProfile => ({
    id: row.user_id as string,
    alias: (row.username as string) ?? 'Sin alias',
    email: (row.user_email as string) ?? '',
    pin: (row.password as string) ?? '',
    goal: normalizeGoal(row.user_goal as string | null),
    avatarColor: (row.avatar_color as string) ?? '#40E0D0'
});

export async function loginWithAliasPin(alias: string, pin: string): Promise<ServiceResult<UserProfile>> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', alias)
        .eq('password', pin)
        .maybeSingle();

    if (error) {
        console.error('Error al iniciar sesión en Supabase:', error.message);
        return { success: false, error: 'Error al conectar con el servidor. Intenta nuevamente.' };
    }

    if (!data) {
        return { success: false, error: 'Alias o PIN incorrectos.' };
    }

    return { success: true, data: mapRowToProfile(data) };
}

export async function fetchRemoteProfile(userId?: string): Promise<ServiceResult<UserProfile>> {
    if (!userId) {
        return { success: false, error: 'ID de usuario no proporcionado.' };
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error al obtener usuario de Supabase:', error.message);
        return { success: false, error: 'No se pudo cargar el perfil.' };
    }

    if (!data) {
        return { success: false, error: 'Usuario no encontrado.' };
    }

    return { success: true, data: mapRowToProfile(data) };
}

export async function createRemoteProfile(payload: { id?: string; alias: string; email: string; pin: string; goal?: UserProfile['goal']; avatarColor: string; }): Promise<ServiceResult<UserProfile>> {
    const insertPayload: Record<string, string | undefined> = {
        username: payload.alias,
        user_email: payload.email,
        password: payload.pin,
        user_goal: payload.goal,
        avatar_color: payload.avatarColor,
        created_at: today(),
        updated_at: today()
    };

    if (payload.id) {
        insertPayload.user_id = payload.id;
    }

    const { data, error } = await supabase
        .from('users')
        .insert(insertPayload)
        .select('*')
        .single();

    if (error) {
        console.error('Error al crear usuario en Supabase:', error.message);
        const isDuplicate = error.message.includes('duplicate') || error.code === '23505';
        return { 
            success: false, 
            error: isDuplicate ? 'Este alias ya está en uso.' : 'No se pudo crear el usuario. Intenta nuevamente.' 
        };
    }

    return { success: true, data: mapRowToProfile(data) };
}

export async function updateRemoteProfile(userId: string, changes: Partial<{ alias: string; email: string; pin: string; goal?: UserProfile['goal']; avatarColor: string; }>): Promise<ServiceResult<UserProfile>> {
    const mapped: Record<string, string | undefined> = {
        username: changes.alias,
        user_email: changes.email,
        password: changes.pin,
        user_goal: changes.goal,
        avatar_color: changes.avatarColor,
        updated_at: today()
    };

    Object.keys(mapped).forEach(key => {
        if (mapped[key] === undefined) {
            delete mapped[key];
        }
    });

    if (Object.keys(mapped).length === 0) {
        return fetchRemoteProfile(userId);
    }

    const { data, error } = await supabase
        .from('users')
        .update(mapped)
        .eq('user_id', userId)
        .select('*')
        .single();

    if (error) {
        console.error('Error al actualizar usuario en Supabase:', error.message);
        return { success: false, error: 'No se pudo actualizar el perfil.' };
    }

    return { success: true, data: mapRowToProfile(data) };
}
