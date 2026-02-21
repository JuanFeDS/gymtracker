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

export type WorkoutSession = {
    id: string;
    startTime: number;
    endTime?: number;
    exercises: LoggedExercise[];
};

export type Exercise = {
    id: string;
    name: string;
    category: string;
};

export const EXERCISE_DATABASE: Exercise[] = [
    { id: '1', name: 'Bench Press', category: 'Chest' },
    { id: '2', name: 'Squat', category: 'Legs' },
    { id: '3', name: 'Deadlift', category: 'Back' },
    { id: '4', name: 'Overhead Press', category: 'Shoulders' },
    { id: '5', name: 'Barbell Row', category: 'Back' },
    { id: '6', name: 'Lat Pulldown', category: 'Back' },
    { id: '7', name: 'Dumbbell Curl', category: 'Arms' },
    { id: '8', name: 'Tricep Extension', category: 'Arms' },
    { id: '9', name: 'Leg Press', category: 'Legs' },
    { id: '10', name: 'Leg Extension', category: 'Legs' },
];
