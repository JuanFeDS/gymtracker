import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { WorkoutSession, LoggedExercise, SetLog, Exercise } from '../types';
import { EXERCISE_DATABASE } from '../types';

interface ActiveSessionProps {
    session: WorkoutSession;
    onUpdate: (session: WorkoutSession) => void;
    onFinish: () => void;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ session, onUpdate, onFinish }) => {
    const [showExercisePicker, setShowExercisePicker] = useState(false);

    const addExercise = (exercise: Exercise) => {
        const newLoggedExercise: LoggedExercise = {
            id: Math.random().toString(36).substr(2, 9),
            exerciseId: exercise.id,
            name: exercise.name,
            sets: [{ id: Math.random().toString(36).substr(2, 9), reps: 0, weight: 0, completed: false }]
        };

        onUpdate({
            ...session,
            exercises: [...session.exercises, newLoggedExercise]
        });
        setShowExercisePicker(false);
    };

    const addSet = (exerciseId: string) => {
        const updatedExercises = session.exercises.map(ex => {
            if (ex.id === exerciseId) {
                const lastSet = ex.sets[ex.sets.length - 1];
                return {
                    ...ex,
                    sets: [...ex.sets, {
                        id: Math.random().toString(36).substr(2, 9),
                        reps: lastSet?.reps || 0,
                        weight: lastSet?.weight || 0,
                        completed: false
                    }]
                };
            }
            return ex;
        });
        onUpdate({ ...session, exercises: updatedExercises });
    };

    const updateSet = (exerciseId: string, setId: string, updates: Partial<SetLog>) => {
        const updatedExercises = session.exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
                };
            }
            return ex;
        });
        onUpdate({ ...session, exercises: updatedExercises });
    };

    return (
        <div className="flex flex-col gap-xl">
            <div className="flex justify-between items-center">
                <h2 style={{ fontSize: '1.5rem' }}>Active Session</h2>
                <button
                    onClick={onFinish}
                    style={{
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        background: 'var(--accent)',
                        color: 'black',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: 700
                    }}
                >
                    FINISH
                </button>
            </div>

            <div className="flex flex-col gap-md">
                {session.exercises.map((ex) => (
                    <div key={ex.id} className="glass" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--primary)' }}>{ex.name}</h3>

                        <div className="flex flex-col gap-sm">
                            <div className="flex gap-sm items-center" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '40px' }}>
                                <span style={{ flex: 1 }}>SET</span>
                                <span style={{ width: '60px', textAlign: 'center' }}>KG</span>
                                <span style={{ width: '60px', textAlign: 'center' }}>REPS</span>
                                <span style={{ width: '30px' }}></span>
                            </div>

                            {ex.sets.map((set, index) => (
                                <div key={set.id} className="flex gap-sm items-center">
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: set.completed ? 'var(--primary)' : 'var(--surface-hover)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        color: set.completed ? 'black' : 'var(--text-muted)',
                                        transition: 'var(--transition-fast)'
                                    }}>
                                        {index + 1}
                                    </div>

                                    <input
                                        type="number"
                                        value={set.weight || ''}
                                        onChange={(e) => updateSet(ex.id, set.id, { weight: Number(e.target.value) })}
                                        placeholder="0"
                                        style={{
                                            flex: 1,
                                            background: 'var(--surface-color)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '8px',
                                            color: 'var(--text-main)',
                                            textAlign: 'center'
                                        }}
                                    />

                                    <input
                                        type="number"
                                        value={set.reps || ''}
                                        onChange={(e) => updateSet(ex.id, set.id, { reps: Number(e.target.value) })}
                                        placeholder="0"
                                        style={{
                                            flex: 1,
                                            background: 'var(--surface-color)',
                                            border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '8px',
                                            color: 'var(--text-main)',
                                            textAlign: 'center'
                                        }}
                                    />

                                    <button
                                        onClick={() => updateSet(ex.id, set.id, { completed: !set.completed })}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: set.completed ? 'var(--primary)' : 'var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={set.completed ? "black" : "white"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => addSet(ex.id)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    background: 'var(--surface-hover)',
                                    borderRadius: 'var(--radius-sm)',
                                    marginTop: 'var(--spacing-xs)',
                                    fontSize: '0.8rem',
                                    fontWeight: 600
                                }}
                            >
                                + ADD SET
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => setShowExercisePicker(true)}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '2px dashed var(--border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--primary)',
                        fontWeight: 700
                    }}
                >
                    + ADD EXERCISE
                </button>
            </div>

            {showExercisePicker && createPortal(
                <div className="modal-overlay">
                    <div className="modal-sheet animate-slide-up">
                        <div className="modal-sheet-handle" />

                        <div className="modal-sheet-header">
                            <h3>Select Exercise</h3>
                            <button className="modal-close-btn" onClick={() => setShowExercisePicker(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </button>
                        </div>

                        <div className="modal-scroll-area flex flex-col gap-md">
                            {EXERCISE_DATABASE.map(ex => (
                                <button
                                    key={ex.id}
                                    onClick={() => addExercise(ex)}
                                    className="exercise-card"
                                >
                                    <span className="exercise-card-name">{ex.name}</span>
                                    <span className="exercise-card-category">{ex.category}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ActiveSession;
