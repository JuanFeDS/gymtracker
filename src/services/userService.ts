import type { UserProfile } from '../types';
import { supabase } from './supabaseClient';

const today = () => new Date().toISOString().slice(0, 10);

const normalizeGoal = (goal?: string | null): UserProfile['goal'] => {
    if (!goal) return undefined;
    const allowed = ['fuerza', 'hipertrofia', 'resistencia'] as const;
    return allowed.includes(goal as typeof allowed[number]) ? goal as UserProfile['goal'] : undefined;
};

const mapRowToProfile = (row: any): UserProfile => ({
    id: row.user_id,
    alias: row.username ?? 'Sin alias',
    pin: row.password ?? '',
    goal: normalizeGoal(row.user_goal),
    avatarColor: row.avatar_color ?? '#40E0D0'
});

export async function loginWithAliasPin(alias: string, pin: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', alias)
        .eq('password', pin)
        .maybeSingle();

    if (error) {
        console.error('Error al iniciar sesión en Supabase:', error.message);
        return null;
    }

    if (!data) return null;

    return mapRowToProfile(data);
}

export async function fetchRemoteProfile(userId?: string): Promise<UserProfile | null> {
    if (!userId) return null;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error al obtener usuario de Supabase:', error.message);
        return null;
    }

    if (!data) return null;

    return mapRowToProfile(data);
}

export async function createRemoteProfile(payload: { id?: string; alias: string; pin: string; goal?: UserProfile['goal']; avatarColor: string; }): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('users')
        .insert({
            user_id: payload.id,
            username: payload.alias,
            password: payload.pin,
            user_goal: payload.goal,
            avatar_color: payload.avatarColor,
            created_at: today(),
            updated_at: today()
        })
        .select('*')
        .single();

    if (error) {
        console.error('Error al crear usuario en Supabase:', error.message);
        return null;
    }

    return mapRowToProfile(data);
}

export async function updateRemoteProfile(userId: string, changes: Partial<{ alias: string; pin: string; goal?: UserProfile['goal']; avatarColor: string; }>): Promise<UserProfile | null> {
    const mapped: Record<string, string | undefined> = {
        username: changes.alias,
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
        return null;
    }

    return mapRowToProfile(data);
}
