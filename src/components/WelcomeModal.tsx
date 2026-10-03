import React from 'react';
import Modal from './Modal';

interface WelcomeModalProps {
    open: boolean;
    onClose: () => void;
    username: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose, username }) => {
    return (
        <Modal open={open} onClose={onClose} maxWidth="600px" showCloseButton={false}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '80px',
                    marginBottom: '20px',
                    animation: 'bounce 1s ease-in-out'
                }}>
                    🎉
                </div>
                
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    marginBottom: '12px',
                    animation: 'fadeInUp 0.5s ease-out 0.2s both'
                }}>
                    ¡Bienvenido, {username}!
                </h1>
                
                <p style={{
                    fontSize: '18px',
                    color: 'var(--text-secondary)',
                    marginBottom: '32px',
                    lineHeight: 1.6,
                    animation: 'fadeInUp 0.5s ease-out 0.4s both'
                }}>
                    Tu cuenta ha sido creada exitosamente. Estás listo para comenzar tu viaje fitness.
                </p>

                <div style={{
                    background: 'linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(138, 43, 226, 0.1))',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    marginBottom: '32px',
                    animation: 'fadeInUp 0.5s ease-out 0.6s both'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        marginBottom: '16px',
                        color: 'var(--text-primary)'
                    }}>
                        🎯 Primeros Pasos
                    </h3>
                    <ul style={{
                        textAlign: 'left',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        color: 'var(--text-secondary)'
                    }}>
                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '12px', fontSize: '20px' }}>💪</span>
                            <span>Completa tu primera sesión de entrenamiento</span>
                        </li>
                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '12px', fontSize: '20px' }}>⚖️</span>
                            <span>Registra tu peso corporal</span>
                        </li>
                        <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '12px', fontSize: '20px' }}>🏆</span>
                            <span>Desbloquea tus primeras misiones</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '12px', fontSize: '20px' }}>📈</span>
                            <span>Monitorea tu progreso</span>
                        </li>
                    </ul>
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
                        animation: 'fadeInUp 0.5s ease-out 0.8s both'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(64, 224, 208, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(64, 224, 208, 0.3)';
                    }}
                >
                    ¡Comenzar!
                </button>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </Modal>
    );
};

export default WelcomeModal;
