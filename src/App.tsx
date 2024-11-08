import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard';
import Interventions from './pages/Interventions';
import Tickets from './pages/Tickets';
import Projects from './pages/Projects';
import Clients from './pages/Clients';
import ClientsList from './pages/ClientsList';
import Contracts from './pages/Contracts';
import PricingGrid from './pages/PricingGrid';
import ClientPortal from './pages/ClientPortal';
import Comptabilite from './pages/Comptabilite';
import Entreprise from './pages/Entreprise';
import Aide from './pages/Aide';
import MonCompte from './pages/MonCompte';
import AdminPanel from './pages/AdminPanel';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/interventions" element={<Interventions />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/list" element={<ClientsList />} />
              <Route path="/clients/contracts" element={<Contracts />} />
              <Route path="/clients/pricing-grid" element={<PricingGrid />} />
              <Route path="/comptabilite" element={<Comptabilite />} />
              <Route path="/entreprise" element={<Entreprise />} />
              <Route path="/aide" element={<Aide />} />
              <Route path="/compte" element={<MonCompte />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;