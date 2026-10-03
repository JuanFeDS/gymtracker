import React, { useEffect } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidth?: string;
    showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
    open, 
    onClose, 
    children, 
    title, 
    maxWidth = '500px',
    showCloseButton = true 
}) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
                animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--surface-color)',
                    borderRadius: 'var(--radius-lg)',
                    maxWidth,
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                    animation: 'slideUp 0.3s ease-out',
                    position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '16px',
                            right: '16px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--border)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        ×
                    </button>
                )}
                
                {title && (
                    <div style={{
                        padding: '24px 24px 16px',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: '24px',
                            fontWeight: 700,
                            color: 'var(--text-primary)'
                        }}>
                            {title}
                        </h2>
                    </div>
                )}
                
                <div style={{ padding: title ? '24px' : '32px' }}>
                    {children}
                </div>

                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Modal;
