import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { GoalModal } from '@/components/GoalModal';
import Sidebar from '@/components/Sidebar';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Board from '@/pages/Board';
import ListView from '@/pages/ListView';
import Investors from '@/pages/Investors';
import Analytics from '@/pages/Analytics';
import Reports from '@/pages/Reports';
import Tasks from '@/pages/Tasks';
import Emails from '@/pages/Emails';
import WorkflowEditor from '@/pages/WorkflowEditor';
import Team from '@/pages/Team';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Portfolio from '@/pages/Portfolio';

// Global constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Initialize query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
    },
  },
});

const App = () => {
  // State for managing the visibility of the goal modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Function to open the goal modal
  const openGoalModal = () => {
    setIsGoalModalOpen(true);
  };

  // Function to close the goal modal
  const closeGoalModal = () => {
    setIsGoalModalOpen(false);
  };

  // Mock data for demonstration purposes
  const mockGoals = [
    { id: 1, name: 'Increase MRR by 20%', target: 50000, current: 40000 },
    { id: 2, name: 'Acquire 5 new customers', target: 5, current: 3 },
  ];

  // State to hold the list of goals
  const [goals, setGoals] = useState(mockGoals);

  // Function to add a new goal
  const addGoal = (newGoal: any) => {
    setGoals([...goals, { ...newGoal, id: goals.length + 1 }]);
  };

  // Function to update a goal
  const updateGoal = (updatedGoal: any) => {
    setGoals(goals.map(goal => (goal.id === updatedGoal.id ? updatedGoal : goal)));
  };

  // Function to delete a goal
  const deleteGoal = (goalId: number) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  // useEffect hook to perform side effects, such as fetching data
  useEffect(() => {
    // Example: Fetch goals from an API endpoint
    // fetch(`${API_URL}/goals`)
    //   .then(response => response.json())
    //   .then(data => setGoals(data))
    //   .catch(error => console.error("Failed to fetch goals:", error));
  }, []);

  return (
    <div className="app flex min-h-screen dark:bg-background">
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <AuthProvider>
          <Router>
            <GoalModal />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 max-h-screen overflow-y-auto pb-10">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/board" element={<Board />} />
                  <Route path="/list" element={<ListView />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/investors" element={<Investors />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/emails" element={<Emails />} />
                  <Route path="/workflow" element={<WorkflowEditor />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
