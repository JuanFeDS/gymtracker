import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const config = {
        success: { bg: '#10b981', icon: '✓', shadow: 'rgba(16, 185, 129, 0.3)' },
        error: { bg: '#ef4444', icon: '✕', shadow: 'rgba(239, 68, 68, 0.3)' },
        info: { bg: '#3b82f6', icon: 'ℹ', shadow: 'rgba(59, 130, 246, 0.3)' }
    }[type];

    return (
        <>
            <div style={{
                position: 'fixed',
                top: '24px',
                right: '24px',
                left: 'auto',
                background: 'var(--surface-color)',
                border: `2px solid ${config.bg}`,
                borderRadius: 'var(--radius-md)',
                boxShadow: `0 8px 24px ${config.shadow}, 0 2px 8px rgba(0, 0, 0, 0.1)`,
                zIndex: 1000,
                minWidth: '320px',
                maxWidth: '450px',
                animation: 'slideInRight 0.3s ease-out, fadeOut 0.3s ease-in 3.7s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 20px',
                cursor: 'pointer'
            }}
            onClick={onClose}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: config.bg,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 700,
                    flexShrink: 0,
                    animation: 'scaleIn 0.3s ease-out 0.1s both'
                }}>
                    {config.icon}
                </div>
                
                <div style={{
                    flex: 1,
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    fontWeight: 500,
                    lineHeight: 1.4
                }}>
                    {message}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '4px',
                        lineHeight: 1,
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                    ×
                </button>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                
                @keyframes scaleIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }
            `}</style>
        </>
    );
};

export default Toast;
