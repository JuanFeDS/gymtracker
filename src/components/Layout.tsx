import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';

interface LayoutProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    });

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    return (
        <div className="flex flex-col" style={{ minHeight: '100%', width: '100%', maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="glass"
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    color: 'var(--text-main)',
                    border: '1px solid var(--border)'
                }}
            >
                {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                )}
            </button>

            <main style={{
                flex: 1,
                padding: 'var(--spacing-lg)',
                paddingBottom: '100px',
                width: '100%'
            }}>
                <div className="animate-fade-in" key={activeTab}>
                    {children}
                </div>
            </main>

            <BottomNav activeTab={activeTab} setActiveTab={onTabChange} />

            {/* Background Glows for Premium Look */}
            <div style={{
                position: 'fixed',
                top: '10%',
                left: '-10%',
                width: '300px',
                height: '300px',
                background: 'var(--primary-glow)',
                filter: 'blur(100px)',
                zIndex: -1,
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'fixed',
                bottom: '20%',
                right: '-10%',
                width: '250px',
                height: '250px',
                background: theme === 'dark' ? 'hsla(80, 100%, 50%, 0.1)' : 'hsla(80, 100%, 50%, 0.05)',
                filter: 'blur(80px)',
                zIndex: -1,
                borderRadius: '50%'
            }} />
        </div>
    );
};

export default Layout;
