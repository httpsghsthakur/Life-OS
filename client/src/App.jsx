import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';

import Challenges from './pages/Challenges';
import CreateChallenge from './pages/CreateChallenge';
import ChallengeDetail from './pages/ChallengeDetail';
import Friends from './pages/Friends';
import ReviewDashboard from './pages/ReviewDashboard';
import ExamDashboard from './pages/ExamDashboard';
import GymDashboard from './pages/GymDashboard';
import DevDashboard from './pages/DevDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

import CalendarDashboard from './pages/CalendarDashboard';
import KnowledgeDashboard from './pages/KnowledgeDashboard';
import AICoachDashboard from './pages/AICoachDashboard';
import NotificationsDashboard from './pages/NotificationsDashboard';
import GoalWorkspace from './pages/GoalWorkspace';
import PartnerDashboard from './pages/PartnerDashboard';

import CommandPalette from './components/navigation/CommandPalette';
import FloatingActionMenu from './components/navigation/FloatingActionMenu';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

import PalantirLayout from './components/layout/PalantirLayout';

const ProtectedLayout = ({ children, onOpenCommandPalette }) => (
  <ProtectedRoute>
    <PalantirLayout onOpenCommandPalette={onOpenCommandPalette}>
      {children}
    </PalantirLayout>
  </ProtectedRoute>
);

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  const [isCmdOpen, setIsCmdOpen] = React.useState(false);

  if (loading) return <div className="min-h-screen bg-[#080B10] flex items-center justify-center font-mono text-cyan-400">INITIALIZING PALANTIR FOUNDRY CONSOLE...</div>;

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        
        <Route path="/" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><Dashboard onOpenCommandPalette={() => setIsCmdOpen(true)} /></ProtectedLayout>} />
        <Route path="/tasks" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><Tasks /></ProtectedLayout>} />
        <Route path="/challenges" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><Challenges /></ProtectedLayout>} />
        <Route path="/challenges/new" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><CreateChallenge /></ProtectedLayout>} />
        <Route path="/challenges/:id" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><ChallengeDetail /></ProtectedLayout>} />
        <Route path="/friends" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><Friends /></ProtectedLayout>} />
        <Route path="/friends/:friendId" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><PartnerDashboard /></ProtectedLayout>} />
        <Route path="/reviews" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><ReviewDashboard /></ProtectedLayout>} />
        <Route path="/exams" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><ExamDashboard /></ProtectedLayout>} />
        <Route path="/gym" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><GymDashboard /></ProtectedLayout>} />
        <Route path="/dev" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><DevDashboard /></ProtectedLayout>} />
        <Route path="/analytics" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><AnalyticsDashboard /></ProtectedLayout>} />
        <Route path="/calendar" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><CalendarDashboard /></ProtectedLayout>} />
        <Route path="/knowledge" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><KnowledgeDashboard /></ProtectedLayout>} />
        <Route path="/ai-coach" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><AICoachDashboard /></ProtectedLayout>} />
        <Route path="/notifications" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><NotificationsDashboard /></ProtectedLayout>} />
        <Route path="/goals/workspace/:goalId" element={<ProtectedLayout onOpenCommandPalette={() => setIsCmdOpen(true)}><GoalWorkspace /></ProtectedLayout>} />
      </Routes>
      {user && (
        <>
          <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
          <FloatingActionMenu />
        </>
      )}
    </>
  );
}

import ExamShield from './components/navigation/ExamShield';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ExamShield>
          <AppRoutes />
        </ExamShield>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
