export type SetLog = {
    id: string;
    reps: number;
    weight: number;
    rpe?: number;
    completed: boolean;
};

export type LoggedExercise = {
    id: string;
    exerciseId: string;
    name: string;
    sets: SetLog[];
};

export type SessionMetrics = {
    totalSets: number;
    totalVolume: number;
    durationMinutes: number;
};

export type WorkoutSession = {
    id: string;
    startTime: number;
    exercises: LoggedExercise[];
    endTime?: number;
    metrics?: SessionMetrics;
};

export type CompletedSession = WorkoutSession & {
    endTime: number;
    metrics: SessionMetrics;
};

export type WeightLog = {
    id: string;
    date: string;
    weight: number;
};

export type GamificationMission = {
    id: string;
    title: string;
    description: string;
    progress: number;
    goal: number;
    rewardXp: number;
};

export type GamificationStats = {
    xp: number;
    level: number;
    nextLevelXp: number;
    streakDays: number;
    missions: GamificationMission[];
};

export type UserProfile = {
    id: string;
    alias: string;
    pin: string;
    goal?: 'fuerza' | 'hipertrofia' | 'resistencia';
    avatarColor: string;
};

export type Exercise = {
    id: string;
    name: string;
    category: string;
    image: string;
};

export const EXERCISE_DATABASE: Exercise[] = [
    { id: '1', name: 'Bench Press', category: 'Chest', image: 'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=400&q=60' },
    { id: '2', name: 'Back Squat', category: 'Legs', image: 'https://images.unsplash.com/photo-1526404079166-546bde31d82d?auto=format&fit=crop&w=400&q=60' },
    { id: '3', name: 'Deadlift', category: 'Back', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=400&q=60' },
    { id: '4', name: 'Overhead Press', category: 'Shoulders', image: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&w=400&q=60' },
    { id: '5', name: 'Barbell Row', category: 'Back', image: 'https://images.unsplash.com/photo-1519500528352-2d1460418d51?auto=format&fit=crop&w=400&q=60' },
    { id: '6', name: 'Lat Pulldown', category: 'Back', image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&q=60' },
    { id: '7', name: 'Dumbbell Curl', category: 'Arms', image: 'https://images.unsplash.com/photo-1517341728662-4aaa5293fb60?auto=format&fit=crop&w=400&q=60' },
    { id: '8', name: 'Tricep Extension', category: 'Arms', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=60' },
    { id: '9', name: 'Leg Press', category: 'Legs', image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=400&q=60' },
    { id: '10', name: 'Bulgarian Split Squat', category: 'Legs', image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=400&q=60' },
];
