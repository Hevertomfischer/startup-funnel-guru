
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Board from "./pages/Board";
import ListView from "./pages/ListView";
import NotFound from "./pages/NotFound";
import WorkflowEditor from "./pages/WorkflowEditor";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import Emails from "./pages/Emails";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Investors from "./pages/Investors";
import Profile from "./pages/Profile";
import Portfolio from "./pages/Portfolio";
import { initializeWorkflowRules } from "./utils/workflow-utils";

// Initialize workflow rules with mock data if none exist
initializeWorkflowRules();

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="board" element={<Board />} />
              <Route path="list" element={<ListView />} />
              <Route path="workflow" element={<WorkflowEditor />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="team" element={<Team />} />
              <Route path="emails" element={<Emails />} />
              <Route path="reports" element={<Reports />} />
              <Route path="investors" element={<Investors />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
