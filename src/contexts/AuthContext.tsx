import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser } from '../services/authService';

type Role = 'student' | 'mentor' | 'admin';

interface AuthContextType {
  user: AuthUser | null;
  devRole: Role;
  setDevRole: (r: Role) => void;
  login: (u: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEV_USERS: Record<Role, AuthUser> = {
  student: {
    id: 's1', name: 'Aryan Sharma', email: 'aryan.sharma@jklu.edu.in', role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan',
  },
  mentor: {
    id: 'm1', name: 'Dr. Rajesh Kumar', email: 'rajesh.kumar@jklu.edu.in', role: 'mentor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshK',
  },
  admin: {
    id: 'admin1', name: 'Admin', email: 'admin@jklu.edu.in', role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [devRole, setDevRoleState] = useState<Role>('student');

  const setDevRole = (r: Role) => {
    setDevRoleState(r);
    setUser(DEV_USERS[r]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      devRole,
      setDevRole,
      login: setUser,
      logout: () => setUser(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
