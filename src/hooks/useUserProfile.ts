import { useCallback, useEffect, useRef, useState } from 'react';
import type { UserProfile } from '../types';
import { loadJSON, removeKey, saveJSON } from '../utils/storage';
import { generateId } from '../utils/id';
import { createRemoteProfile, fetchRemoteProfile, loginWithAliasPin, updateRemoteProfile as updateRemoteProfileRecord } from '../services/userService';

const STORAGE_KEY = 'userProfile';

const randomColor = () => {
    const palette = ['#40E0D0', '#A855F7', '#F472B6', '#22D3EE', '#FACC15'];
    return palette[Math.floor(Math.random() * palette.length)];
};

type NewProfile = Omit<UserProfile, 'id' | 'avatarColor'>;
type UpdateProfile = Partial<Omit<UserProfile, 'id'>>;

export const useUserProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(() =>
        loadJSON<UserProfile | null>(STORAGE_KEY, null)
    );
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const syncedIdRef = useRef<string | null>(null);

    const persistProfile = useCallback((next: UserProfile | null) => {
        setProfile(next);
        if (next) {
            saveJSON(STORAGE_KEY, next);
        } else {
            removeKey(STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        const userId = profile?.id;
        if (!userId || syncedIdRef.current === userId) return;

        let cancelled = false;

        (async () => {
            setSyncing(true);
            const remote = await fetchRemoteProfile(userId);
            if (!cancelled && remote) {
                persistProfile(remote);
            }
            if (!cancelled) {
                syncedIdRef.current = userId;
                setSyncing(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [profile?.id, persistProfile]);

    const saveProfile = useCallback((data: NewProfile) => {
        const fallback: UserProfile = {
            ...data,
            id: generateId(),
            avatarColor: randomColor()
        };

        persistProfile(fallback);
        setError(null);

        (async () => {
            setSyncing(true);
            const remote = await createRemoteProfile({
                alias: data.alias,
                pin: data.pin,
                goal: data.goal,
                avatarColor: fallback.avatarColor
            });
            if (remote) {
                persistProfile(remote);
                syncedIdRef.current = remote.id;
            }
            setSyncing(false);
        })();
    }, [persistProfile]);

    const login = useCallback(async (alias: string, pin: string) => {
        setSyncing(true);
        const remote = await loginWithAliasPin(alias, pin);
        setSyncing(false);

        if (!remote) {
            setError('Alias o PIN incorrecto.');
            return { success: false } as const;
        }

        persistProfile(remote);
        syncedIdRef.current = remote.id;
        setError(null);
        return { success: true } as const;
    }, [persistProfile]);

    const updateProfile = useCallback((changes: UpdateProfile) => {
        if (!profile) return;
        const optimistic: UserProfile = { ...profile, ...changes } as UserProfile;
        persistProfile(optimistic);
        setError(null);

        (async () => {
            setSyncing(true);
            const remote = await updateRemoteProfileRecord(profile.id, {
                alias: optimistic.alias,
                pin: optimistic.pin,
                goal: optimistic.goal,
                avatarColor: optimistic.avatarColor
            });
            if (remote) {
                persistProfile(remote);
                syncedIdRef.current = remote.id;
            }
            setSyncing(false);
        })();
    }, [persistProfile, profile]);

    const logout = useCallback(() => {
        persistProfile(null);
        syncedIdRef.current = null;
        setError(null);
    }, [persistProfile]);

    return {
        profile,
        saveProfile,
        login,
        updateProfile,
        logout,
        syncing,
        authError: error
    };
};
