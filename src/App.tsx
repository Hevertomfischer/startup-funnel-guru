
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, RequireAuth } from '@/auth';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import ListView from './pages/ListView';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Investors from './pages/Investors';
import Team from './pages/Team';
import Portfolio from './pages/Portfolio';
import Reports from './pages/Reports';
import Emails from './pages/Emails';
import Settings from './pages/Settings';
import WorkflowEditor from './pages/WorkflowEditor';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Layout from '@/components/Layout';
import Diagnostico from './pages/Diagnostico';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background font-sans antialiased">
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/diagnostico" element={<Diagnostico />} />
                <Route
                  path="/*"
                  element={
                    <RequireAuth>
                      <Layout>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/board" element={<Board />} />
                          <Route path="/list-view" element={<ListView />} />
                          <Route path="/tasks" element={<Tasks />} />
                          <Route path="/analytics" element={<Analytics />} />
                          <Route path="/investors" element={<Investors />} />
                          <Route path="/team" element={<Team />} />
                          <Route path="/portfolio" element={<Portfolio />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/emails" element={<Emails />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/workflow" element={<WorkflowEditor />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Layout>
                    </RequireAuth>
                  }
                />
              </Routes>
            </Router>
          </AuthProvider>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
