/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import Scanner from '@/pages/Scanner';
import AttackLab from '@/pages/AttackLab';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
         <div className="absolute inset-0 border-4 border-cyan-500/10 rounded-full animate-pulse" />
         <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-[10px] font-mono text-cyan-400 tracking-[0.4em] uppercase animate-pulse">Initializing_Session</p>
        <p className="text-[8px] font-mono text-slate-700 tracking-widest uppercase">Sentinel-AI // Security Protocol 4.2.0</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
              <Route path="/lab" element={<ProtectedRoute><AttackLab /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
            <Toaster 
              position="top-right" 
              toastOptions={{
                className: 'bg-slate-900 border-slate-800 text-slate-100 rounded-2xl shadow-2xl',
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
