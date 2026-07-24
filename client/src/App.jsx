import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

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

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  const [isCmdOpen, setIsCmdOpen] = React.useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard onOpenCommandPalette={() => setIsCmdOpen(true)} /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
        <Route path="/challenges/new" element={<ProtectedRoute><CreateChallenge /></ProtectedRoute>} />
        <Route path="/challenges/:id" element={<ProtectedRoute><ChallengeDetail /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/friends/:friendId" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><ReviewDashboard /></ProtectedRoute>} />
        <Route path="/exams" element={<ProtectedRoute><ExamDashboard /></ProtectedRoute>} />
        <Route path="/gym" element={<ProtectedRoute><GymDashboard /></ProtectedRoute>} />
        <Route path="/dev" element={<ProtectedRoute><DevDashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarDashboard /></ProtectedRoute>} />
        <Route path="/knowledge" element={<ProtectedRoute><KnowledgeDashboard /></ProtectedRoute>} />
        <Route path="/ai-coach" element={<ProtectedRoute><AICoachDashboard /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsDashboard /></ProtectedRoute>} />
        <Route path="/goals/workspace/:goalId" element={<ProtectedRoute><GoalWorkspace /></ProtectedRoute>} />
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
