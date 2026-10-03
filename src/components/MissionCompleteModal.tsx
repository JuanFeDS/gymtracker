import React from 'react';
import Modal from './Modal';

interface CompletedMission {
    title: string;
    reward_xp: number;
    description?: string;
}

interface MissionCompleteModalProps {
    open: boolean;
    onClose: () => void;
    missions: CompletedMission[];
}

const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({ open, onClose, missions }) => {
    if (missions.length === 0) return null;

    const totalXP = missions.reduce((acc, m) => acc + m.reward_xp, 0);

    return (
        <Modal open={open} onClose={onClose} maxWidth="550px">
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '100px',
                    marginBottom: '20px',
                    animation: 'celebrate 0.8s ease-in-out'
                }}>
                    🏆
                </div>
                
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '12px',
                    animation: 'fadeInScale 0.5s ease-out 0.2s both'
                }}>
                    ¡Misión{missions.length > 1 ? 'es' : ''} Completada{missions.length > 1 ? 's' : ''}!
                </h1>
                
                <p style={{
                    fontSize: '18px',
                    color: 'var(--text-secondary)',
                    marginBottom: '32px',
                    animation: 'fadeInScale 0.5s ease-out 0.3s both'
                }}>
                    Has ganado <strong style={{ color: 'var(--primary)' }}>{totalXP} XP</strong>
                </p>

                <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginBottom: '32px'
                }}>
                    {missions.map((mission, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: 'linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(138, 43, 226, 0.1))',
                                borderRadius: 'var(--radius-md)',
                                padding: '20px',
                                marginBottom: '16px',
                                textAlign: 'left',
                                border: '2px solid rgba(64, 224, 208, 0.3)',
                                animation: `slideInRight 0.5s ease-out ${0.4 + idx * 0.1}s both`
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '8px'
                            }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    margin: 0
                                }}>
                                    {mission.title}
                                </h3>
                                <span style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}>
                                    +{mission.reward_xp} XP
                                </span>
                            </div>
                            {mission.description && (
                                <p style={{
                                    fontSize: '14px',
                                    color: 'var(--text-secondary)',
                                    margin: 0
                                }}>
                                    {mission.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        color: 'white',
                        border: 'none',
                        padding: '16px 48px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '18px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(64, 224, 208, 0.3)',
                        transition: 'all 0.3s ease',
                        animation: `fadeInScale 0.5s ease-out ${0.5 + missions.length * 0.1}s both`
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(64, 224, 208, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(64, 224, 208, 0.3)';
                    }}
                >
                    ¡Continuar!
                </button>
            </div>

            <style>{`
                @keyframes celebrate {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    25% { transform: rotate(-10deg) scale(1.1); }
                    75% { transform: rotate(10deg) scale(1.1); }
                }
                
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </Modal>
    );
};

export default MissionCompleteModal;
