import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Pages
import { RoleSelectPage } from './pages/auth/RoleSelectPage';
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Student Pages
import { FeedPage } from './pages/student/FeedPage';
import { ProfilePage } from './pages/student/ProfilePage';
import { SearchPage } from './pages/student/SearchPage';
import { NotificationsPage } from './pages/student/NotificationsPage';

// Mentor Pages
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { BatchPage } from './pages/mentor/BatchPage';
import { StudentReviewPage } from './pages/mentor/StudentReviewPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { MentorLayout, AdminLayout } from './layouts/MentorAdminLayout';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/select-role" replace />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/select-role" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Landing: Role Selection */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={
                user.role === 'mentor'
                  ? '/mentor/dashboard'
                  : user.role === 'admin'
                  ? '/admin/dashboard'
                  : '/feed'
              }
              replace
            />
          ) : (
            <RoleSelectPage />
          )
        }
      />
      <Route path="/select-role" element={<RoleSelectPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Student Routes */}
      <Route path="/" element={<ProtectedRoute requiredRole="student"><StudentLayout /></ProtectedRoute>}>
        <Route path="feed" element={<FeedPage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Mentor Routes */}
      <Route path="/mentor" element={<ProtectedRoute requiredRole="mentor"><MentorLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<MentorDashboard />} />
        <Route path="batch/:batchId" element={<BatchPage />} />
        <Route path="student/:id" element={<StudentReviewPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
