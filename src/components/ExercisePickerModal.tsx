import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Exercise } from '../types';

interface ExercisePickerModalProps {
    open: boolean;
    exercises: Exercise[];
    onSelect: (exercise: Exercise) => void;
    onClose: () => void;
}

const ALL = 'Todos';

const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({ open, exercises, onSelect, onClose }) => {
    const [filter, setFilter] = useState<string>(ALL);

    const categories = useMemo(() => {
        const unique = Array.from(new Set(exercises.map((ex) => ex.category)));
        return [ALL, ...unique];
    }, [exercises]);

    const filteredExercises = useMemo(() => {
        if (filter === ALL) return exercises;
        return exercises.filter((ex) => ex.category === filter);
    }, [exercises, filter]);

    if (!open) return null;

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-sheet animate-slide-up">
                <div className="modal-sheet-handle" />

                <div className="modal-sheet-header">
                    <div>
                        <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Agregar ejercicio</p>
                        <h3>Explora por grupo muscular</h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                <div className="modal-filter-row">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`filter-chip ${filter === category ? 'filter-chip--active' : ''}`}
                            onClick={() => setFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="modal-scroll-area exercise-grid">
                    {filteredExercises.map((exercise) => (
                        <button
                            key={exercise.id}
                            className="exercise-card"
                            onClick={() => onSelect(exercise)}
                        >
                            <div
                                className="exercise-card-media"
                                style={{ backgroundImage: `url(${exercise.image})` }}
                            />
                            <div className="exercise-card-info">
                                <span className="exercise-card-category">{exercise.category}</span>
                                <span className="exercise-card-name">{exercise.name}</span>
                            </div>
                        </button>
                    ))}
                    {filteredExercises.length === 0 && (
                        <p style={{ textAlign: 'center', opacity: 0.6 }}>No hay ejercicios para este grupo.</p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExercisePickerModal;
