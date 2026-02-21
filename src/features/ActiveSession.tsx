import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { WorkoutSession, LoggedExercise, SetLog, Exercise } from '../types';
import { EXERCISE_DATABASE } from '../types';

const NumberStepper = ({ value, onChange, min = 0, step = 1 }: { value: number, onChange: (v: number) => void, min?: number, step?: number }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--surface-color)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        height: '42px',
        width: '100%',
        minWidth: 0
    }}>
        <button
            onClick={() => onChange(Math.max(min, (value || 0) - step))}
            style={{ width: '32px', height: '100%', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}
        >-</button>
        <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder="0"
            style={{
                flex: 1, minWidth: 0, textAlign: 'center', background: 'transparent', outline: 'none',
                border: 'none', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700, padding: 0
            }}
        />
        <button
            onClick={() => onChange((value || 0) + step)}
            style={{ width: '32px', height: '100%', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}
        >+</button>
    </div>
);

interface ActiveSessionProps {
    session: WorkoutSession;
    onUpdate: (session: WorkoutSession) => void;
    onFinish: () => void;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ session, onUpdate, onFinish }) => {
    const [showExercisePicker, setShowExercisePicker] = useState(false);
    const [unit, setUnit] = useState<'KG' | 'LB'>('KG');

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
                            <div style={{
                                display: 'grid', gridTemplateColumns: '32px 1fr 1fr 32px', gap: 'var(--spacing-sm)',
                                alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px'
                            }}>
                                <span style={{ textAlign: 'center', fontWeight: '600' }}>SET</span>
                                <button
                                    onClick={() => setUnit(unit === 'KG' ? 'LB' : 'KG')}
                                    style={{
                                        width: '100%',
                                        textAlign: 'center',
                                        background: 'transparent',
                                        padding: '4px 0',
                                        color: 'var(--primary)',
                                        fontWeight: 800,
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {unit}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                                <span style={{ textAlign: 'center', fontWeight: '600' }}>REPS</span>
                                <span></span>
                            </div>

                            {ex.sets.map((set, index) => (
                                <div key={set.id} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 32px', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
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

                                    <NumberStepper
                                        value={set.weight}
                                        onChange={(val) => updateSet(ex.id, set.id, { weight: val })}
                                        step={0.5}
                                        min={0}
                                    />

                                    <NumberStepper
                                        value={set.reps}
                                        onChange={(val) => updateSet(ex.id, set.id, { reps: val })}
                                        step={1}
                                        min={0}
                                    />

                                    <button
                                        onClick={() => updateSet(ex.id, set.id, { completed: !set.completed })}
                                        style={{
                                            width: '32px',
                                            height: '42px',
                                            borderRadius: 'var(--radius-sm)',
                                            background: set.completed ? 'var(--primary)' : 'var(--surface-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '1px solid var(--border)',
                                            color: set.completed ? 'black' : 'var(--text-muted)',
                                            transition: 'var(--transition-fast)'
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={set.completed ? "black" : "var(--text-muted)"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
