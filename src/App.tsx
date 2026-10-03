import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout';
import PageHeader from './components/PageHeader';
import Toast from './components/Toast';
import OnboardingView from './views/OnboardingView';

const WorkoutView = lazy(() => import('./views/WorkoutView'));
const WeightView = lazy(() => import('./views/WeightView'));
const HomeView = lazy(() => import('./views/HomeView'));
const GamificationView = lazy(() => import('./views/GamificationView'));
const ProgressView = lazy(() => import('./views/ProgressView'));
const ProfileView = lazy(() => import('./views/ProfileView'));
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { useWeightLogs } from './hooks/useWeightLogs';
import { useWorkoutStats } from './hooks/useWorkoutStats';
import { useWeightTrend } from './hooks/useWeightTrend';
import { useGamificationStats } from './hooks/useGamificationStats';
import { useSessionHistory } from './hooks/useSessionHistory';
import { useUserProfile } from './hooks/useUserProfile';
import { useToast } from './hooks/useToast';
import { saveCompletedSession } from './services/sessionService';
import { updateMissionProgress } from './services/missionService';
import type { CompletedSession } from './types';
import WelcomeModal from './components/WelcomeModal';
import MissionCompleteModal from './components/MissionCompleteModal';

const TAB_COPY: Record<string, { subtitle: string; title: string }> = {
  home: { subtitle: 'Resumen general', title: 'Dashboard' },
  workout: { subtitle: 'Modo entrenamiento', title: 'Sesión activa' },
  weight: { subtitle: 'Seguimiento corporal', title: 'Peso corporal' },
  progress: { subtitle: 'Historial y métricas', title: 'Progreso' },
  gamification: { subtitle: 'Motivación diaria', title: 'Academy' }
};

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { toast, showToast, hideToast } = useToast();
  const { profile, saveProfile, login, updateProfile, logout, syncing, authError } = useUserProfile();
  const { sessions, addSession } = useSessionHistory(profile?.id);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [completedMissions, setCompletedMissions] = useState<Array<{title: string; reward_xp: number; description: string}>>([]);
  
  const handleSessionComplete = useCallback(async (completedSession: CompletedSession) => {
    addSession(completedSession);
    if (profile?.id) {
      await saveCompletedSession(profile.id, completedSession);
      const newlyCompleted = await updateMissionProgress(profile.id, completedSession);
      if (newlyCompleted.length > 0) {
        setCompletedMissions(newlyCompleted);
        setShowMissionModal(true);
      }
    }
  }, [addSession, profile]);
  const { session, startSession, finishSession, updateSession } = useWorkoutSession(handleSessionComplete);
  const { logs: weightLogs, addLog, deleteLog: deleteWeightLog, loading: weightLoading } = useWeightLogs(profile?.id);
  const [newWeight, setNewWeight] = useState('');
  const gamification = useGamificationStats(profile?.id);

  const workoutStats = useWorkoutStats(session);
  const weightTrend = useWeightTrend(weightLogs);

  const headerCopy = useMemo(() => TAB_COPY[activeTab] ?? TAB_COPY.home, [activeTab]);
  const subtitle = profile ? `${headerCopy.subtitle} · ${profile.alias}` : headerCopy.subtitle;

  const handleAddWeight = () => {
    if (!newWeight) {
      showToast('Ingresa un valor de peso', 'error');
      return;
    }
    const weightValue = Number(newWeight);
    if (isNaN(weightValue) || weightValue <= 0 || weightValue > 500) {
      showToast('Ingresa un peso válido (1-500 kg)', 'error');
      return;
    }
    addLog(weightValue);
    setNewWeight('');
    showToast('Peso registrado exitosamente', 'success');
  };

  const handleContinueSession = () => {
    setActiveTab('workout');
  };

  const handleProfileCreated = useCallback((newProfile: any) => {
    saveProfile(newProfile);
    setShowWelcomeModal(true);
  }, [saveProfile]);

  useEffect(() => {
    if (authError) {
      showToast(authError, 'error');
    }
  }, [authError, showToast]);

  if (!profile) {
    return (
      <OnboardingView
        onSubmit={handleProfileCreated}
        onLogin={login}
        syncing={syncing}
        authError={authError}
      />
    );
  }

  return (
    <>
      <WelcomeModal 
        open={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        username={profile.alias}
      />
      
      <MissionCompleteModal
        open={showMissionModal}
        onClose={() => setShowMissionModal(false)}
        missions={completedMissions}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="flex flex-col gap-md">
        <PageHeader subtitle={subtitle} title={headerCopy.title} />
        <Suspense fallback={<div className="text-center py-8 text-gray-400">Cargando...</div>}>
        <section>
          {activeTab === 'home' && (
            <HomeView
              stats={workoutStats}
              weightTrend={weightTrend}
              weightLogs={weightLogs}
              sessions={sessions}
              hasActiveSession={Boolean(session)}
              onStartSession={startSession}
              onFinishSession={finishSession}
              onContinueSession={handleContinueSession}
              weeklyGoal={profile?.weeklyGoal || 30}
            />
          )}

          {activeTab === 'workout' && (
            <WorkoutView
              session={session}
              recentSessions={sessions.slice(0, 3)}
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
              onDelete={deleteWeightLog}
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
        </Suspense>
      </div>
    </Layout>
    </>
  )
}

export default App
