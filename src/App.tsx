import { useCallback, useMemo, useState } from 'react';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import WorkoutView from './views/WorkoutView';
import WeightView from './views/WeightView';
import HomeView from './views/HomeView';
import GamificationView from './views/GamificationView';
import ProgressView from './views/ProgressView';
import OnboardingView from './views/OnboardingView';
import ProfileView from './views/ProfileView';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { useWeightLogs } from './hooks/useWeightLogs';
import { useWorkoutStats } from './hooks/useWorkoutStats';
import { useWeightTrend } from './hooks/useWeightTrend';
import { useGamificationStats } from './hooks/useGamificationStats';
import { useSessionHistory } from './hooks/useSessionHistory';
import { useUserProfile } from './hooks/useUserProfile';
import { saveCompletedSession } from './services/sessionService';
import type { CompletedSession } from './types';

const TAB_COPY: Record<string, { subtitle: string; title: string }> = {
  home: { subtitle: 'Resumen general', title: 'Dashboard' },
  workout: { subtitle: 'Modo entrenamiento', title: 'Sesión activa' },
  weight: { subtitle: 'Seguimiento corporal', title: 'Peso corporal' },
  progress: { subtitle: 'Historial y métricas', title: 'Progreso' },
  gamification: { subtitle: 'Motivación diaria', title: 'Academy' }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { profile, saveProfile, login, updateProfile, logout, syncing, authError } = useUserProfile();
  const { sessions, addSession } = useSessionHistory(profile?.id);
  const handleSessionComplete = useCallback((completedSession: CompletedSession) => {
    addSession(completedSession);
    if (profile?.id) {
      saveCompletedSession(profile.id, completedSession);
    }
  }, [addSession, profile?.id]);
  const { session, startSession, finishSession, updateSession } = useWorkoutSession(handleSessionComplete);
  const { logs: weightLogs, addLog, loading: weightLoading } = useWeightLogs(profile?.id);
  const [newWeight, setNewWeight] = useState('');
  const gamification = useGamificationStats(profile?.id);

  const workoutStats = useWorkoutStats(session);
  const weightTrend = useWeightTrend(weightLogs);

  const headerCopy = useMemo(() => TAB_COPY[activeTab] ?? TAB_COPY.home, [activeTab]);
  const subtitle = profile ? `${headerCopy.subtitle} · ${profile.alias}` : headerCopy.subtitle;

  const handleAddWeight = () => {
    if (!newWeight) return;
    addLog(Number(newWeight));
    setNewWeight('');
  };

  if (!profile) {
    return (
      <OnboardingView
        onSubmit={saveProfile}
        onLogin={login}
        syncing={syncing}
        authError={authError}
      />
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-md">
        <PageHeader subtitle={subtitle} title={headerCopy.title} />
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
              loading={weightLoading}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView sessions={sessions} />
          )}

          {activeTab === 'gamification' && (
            <GamificationView stats={gamification.stats} loading={gamification.loading} />
          )}

          {activeTab === 'profile' && profile && (
            <ProfileView profile={profile} onUpdate={updateProfile} onLogout={logout} />
          )}
        </section>
      </div>
    </Layout>
  )
}

export default App
