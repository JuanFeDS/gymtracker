interface PageHeaderProps {
    subtitle: string;
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ subtitle, title }) => (
    <header className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '4px', opacity: 0.8 }}>{subtitle}</p>
            <h1 style={{ fontSize: '1.75rem' }}>{title}</h1>
        </div>
        <div
            className="glass flex items-center justify-center"
            style={{
                width: '45px',
                height: '45px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--primary)'
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        </div>
    </header>
);

export default PageHeader;
