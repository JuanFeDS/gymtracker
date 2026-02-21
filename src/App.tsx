import { useMemo, useState } from 'react';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import WorkoutView from './views/WorkoutView';
import WeightView from './views/WeightView';
import HomeView from './views/HomeView';
import GamificationView from './views/GamificationView';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { useWeightLogs } from './hooks/useWeightLogs';
import { useWorkoutStats } from './hooks/useWorkoutStats';
import { useWeightTrend } from './hooks/useWeightTrend';
import { useGamificationStats } from './hooks/useGamificationStats';

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
  const gamification = useGamificationStats();

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
              weightLogs={weightLogs}
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
            <GamificationView stats={gamification.stats} />
          )}
        </section>
      </div>
    </Layout>
  )
}

export default App
