import { useMemo, useState } from 'react';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import WorkoutView from './views/WorkoutView';
import WeightView from './views/WeightView';
import HomeView from './views/HomeView';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { useWeightLogs } from './hooks/useWeightLogs';
import { useWorkoutStats } from './hooks/useWorkoutStats';
import { useWeightTrend } from './hooks/useWeightTrend';

const TAB_COPY: Record<string, { subtitle: string; title: string }> = {
  home: { subtitle: 'Resumen general', title: 'Dashboard' },
  workout: { subtitle: 'Modo entrenamiento', title: 'Sesión activa' },
  weight: { subtitle: 'Seguimiento corporal', title: 'Peso corporal' },
  progress: { subtitle: 'Historial y métricas', title: 'Progreso' },
  gamification: { subtitle: 'Motivación diaria', title: 'Academy' }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { session, startSession, finishSession, updateSession } = useWorkoutSession();
  const { logs: weightLogs, addLog } = useWeightLogs();
  const [newWeight, setNewWeight] = useState('');

  const workoutStats = useWorkoutStats(session);
  const weightTrend = useWeightTrend(weightLogs);

  const headerCopy = useMemo(() => TAB_COPY[activeTab] ?? TAB_COPY.home, [activeTab]);

  const handleAddWeight = () => {
    if (!newWeight) return;
    addLog(Number(newWeight));
    setNewWeight('');
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-md">
        <PageHeader subtitle={headerCopy.subtitle} title={headerCopy.title} />
        <section>
          {activeTab === 'home' && (
            <HomeView
              stats={workoutStats}
              weightTrend={weightTrend}
              hasActiveSession={Boolean(session)}
              onStartSession={startSession}
              onFinishSession={finishSession}
            />
          )}

          {activeTab === 'workout' && (
            <WorkoutView
              session={session}
              onStart={startSession}
              onFinish={finishSession}
              onUpdate={updateSession}
            />
          )}

          {activeTab === 'weight' && (
            <WeightView
              logs={weightLogs}
              newValue={newWeight}
              onChange={setNewWeight}
              onSubmit={handleAddWeight}
            />
          )}

          {activeTab === 'progress' && (
            <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
              <p>Historial y gráficas en camino...</p>
            </div>
          )}

          {activeTab === 'gamification' && (
            <div className="flex flex-col gap-md">
              <div className="glass flex items-center gap-lg" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ fontSize: '2rem' }}>🔥</div>
                <div>
                  <h3 style={{ color: 'var(--accent)' }}>Streak 3 días</h3>
                  <p style={{ fontSize: '0.8rem' }}>Mantén el ritmo.</p>
                </div>
              </div>

              <div className="glass" style={{ padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--spacing-sm)' }}>
                  <span style={{ fontWeight: 600 }}>Nivel 5</span>
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
    </Layout>
  )
}

export default App
