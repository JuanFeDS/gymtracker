import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    danger = false
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} maxWidth="450px" showCloseButton={false}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '64px',
                    marginBottom: '20px',
                    animation: 'shake 0.5s ease-in-out'
                }}>
                    {danger ? '⚠️' : '❓'}
                </div>
                
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '12px'
                }}>
                    {title}
                </h2>
                
                <p style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    marginBottom: '32px',
                    lineHeight: 1.6
                }}>
                    {message}
                </p>

                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--surface-color)',
                            color: 'var(--text-primary)',
                            border: '2px solid var(--border)',
                            padding: '12px 32px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--border)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--surface-color)';
                        }}
                    >
                        {cancelText}
                    </button>
                    
                    <button
                        onClick={handleConfirm}
                        style={{
                            background: danger ? '#ef4444' : 'linear-gradient(135deg, var(--primary), var(--accent))',
                            color: 'white',
                            border: 'none',
                            padding: '12px 32px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: danger ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(64, 224, 208, 0.3)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = danger 
                                ? '0 6px 20px rgba(239, 68, 68, 0.4)' 
                                : '0 6px 20px rgba(64, 224, 208, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = danger 
                                ? '0 4px 12px rgba(239, 68, 68, 0.3)' 
                                : '0 4px 12px rgba(64, 224, 208, 0.3)';
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `}</style>
        </Modal>
    );
};

export default ConfirmDialog;
