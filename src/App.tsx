import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ActiveSession from './features/ActiveSession';
import type { WorkoutSession } from './types';

function App() {
  console.log('APP COMPONENT RENDERING');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [weightLogs, setWeightLogs] = useState<{ date: string; weight: number }[]>([]);
  const [newWeight, setNewWeight] = useState('');

  // Load data from LocalStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('activeSession');
    if (savedSession) setActiveSession(JSON.parse(savedSession));

    const savedWeight = localStorage.getItem('weightLogs');
    if (savedWeight) setWeightLogs(JSON.parse(savedWeight));
  }, []);

  // Sync session to LocalStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem('activeSession', JSON.stringify(activeSession));
    } else {
      localStorage.removeItem('activeSession');
    }
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem('weightLogs', JSON.stringify(weightLogs));
  }, [weightLogs]);

  const startSession = () => {
    const newSession: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: Date.now(),
      exercises: []
    };
    setActiveSession(newSession);
  };

  const finishSession = () => {
    // Here we would save to history
    setActiveSession(null);
    alert('Session Finished! Nice work.');
  };

  const addWeightLog = () => {
    if (!newWeight) return;
    const log = {
      date: new Date().toLocaleDateString(),
      weight: Number(newWeight)
    };
    setWeightLogs([log, ...weightLogs]);
    setNewWeight('');
  };

  return (
    <Layout>
      {(activeTab) => (
        <div className="flex flex-col gap-md">
          <header className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <p style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Welcome back, Champ</p>
              <h1 style={{ fontSize: '1.75rem' }}>
                {activeTab === 'workout' && 'Your Session'}
                {activeTab === 'weight' && 'Weight Track'}
                {activeTab === 'progress' && 'History'}
                {activeTab === 'gamification' && 'Academy'}
              </h1>
            </div>
            <div className="glass flex items-center justify-center" style={{
              width: '45px',
              height: '45px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
          </header>

          <section>
            {activeTab === 'workout' && (
              <>
                {!activeSession ? (
                  <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>No active session</h3>
                    <p style={{ marginBottom: 'var(--spacing-lg)' }}>Ready to crush some goals today?</p>
                    <button
                      onClick={startSession}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        background: 'var(--primary)',
                        color: 'black',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 0 20px var(--primary-glow)'
                      }}
                    >
                      START NEW SESSION
                    </button>
                  </div>
                ) : (
                  <ActiveSession
                    session={activeSession}
                    onUpdate={setActiveSession}
                    onFinish={finishSession}
                  />
                )}
              </>
            )}

            {activeTab === 'weight' && (
              <div className="flex flex-col gap-md">
                <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Log Today's Weight</h3>
                  <div className="flex gap-sm">
                    <input
                      type="number"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      placeholder="e.g. 75"
                      style={{
                        flex: 1,
                        background: 'var(--surface-color)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--spacing-md)',
                        color: 'var(--text-main)'
                      }}
                    />
                    <button
                      onClick={addWeightLog}
                      style={{
                        padding: '0 var(--spacing-lg)',
                        background: 'var(--primary)',
                        color: 'black',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      LOG
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-sm">
                  {weightLogs.map((log, i) => (
                    <div key={i} className="glass flex justify-between items-center" style={{ padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontWeight: 600 }}>{log.weight} kg</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.date}</span>
                    </div>
                  ))}
                  {weightLogs.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No logs yet</p>}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                <p>History and performance charts coming soon...</p>
              </div>
            )}

            {activeTab === 'gamification' && (
              <div className="flex flex-col gap-md">
                <div className="glass flex items-center gap-lg" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ fontSize: '2rem' }}>🔥</div>
                  <div>
                    <h3 style={{ color: 'var(--accent)' }}>3 Day Streak</h3>
                    <p style={{ fontSize: '0.8rem' }}>Keep it up! You're on fire.</p>
                  </div>
                </div>

                <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ fontWeight: 600 }}>Level 5</span>
                    <span style={{ fontSize: '0.8rem' }}>450 / 1000 XP</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '45%', height: '100%', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary-glow)' }} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </Layout>
  )
}

export default App
