import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from './pages/Index';
import Board from './pages/Board';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ListView from './pages/ListView';
import Tasks from './pages/Tasks';
import StartupImport from './pages/StartupImport';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Team from './pages/Team';
import Emails from './pages/Emails';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Portfolio from './pages/Portfolio';
import Investors from './pages/Investors';
import WorkflowEditor from './pages/WorkflowEditor';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/board',
        element: <Board />,
      },
      {
        path: '/list',
        element: <ListView />,
      },
      {
        path: '/tasks',
        element: <Tasks />,
      },
      {
        path: '/import',
        element: <StartupImport />,
      },
      {
        path: '/team',
        element: <Team />,
      },
      {
        path: '/emails',
        element: <Emails />,
      },
      {
        path: '/analytics',
        element: <Analytics />,
      },
      {
        path: '/reports',
        element: <Reports />,
      },
      {
        path: '/portfolio',
        element: <Portfolio />,
      },
      {
        path: '/investors',
        element: <Investors />,
      },
      {
        path: '/workflow',
        element: <WorkflowEditor />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
