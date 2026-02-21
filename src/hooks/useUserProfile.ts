import { useCallback, useState } from 'react';
import type { UserProfile } from '../types';
import { loadJSON, removeKey, saveJSON } from '../utils/storage';
import { generateId } from '../utils/id';

const STORAGE_KEY = 'userProfile';

const randomColor = () => {
    const palette = ['#40E0D0', '#A855F7', '#F472B6', '#22D3EE', '#FACC15'];
    return palette[Math.floor(Math.random() * palette.length)];
};

type NewProfile = Omit<UserProfile, 'id' | 'avatarColor'>;

export const useUserProfile = () => {
    const [profile, setProfile] = useState<UserProfile | null>(() =>
        loadJSON<UserProfile | null>(STORAGE_KEY, null)
    );

    const saveProfile = useCallback((data: NewProfile) => {
        const next: UserProfile = {
            ...data,
            id: generateId(),
            avatarColor: randomColor()
        };
        setProfile(next);
        saveJSON(STORAGE_KEY, next);
    }, []);

    const logout = useCallback(() => {
        setProfile(null);
        removeKey(STORAGE_KEY);
    }, []);

    return {
        profile,
        saveProfile,
        logout
    };
};
