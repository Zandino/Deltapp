import React from 'react';
import { Users, Building2, Settings } from 'lucide-react';

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Panel Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gestion des utilisateurs */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Gestion des utilisateurs</h2>
          </div>
          <p className="text-gray-600 mb-4">Gérez les techniciens et les administrateurs</p>
          <button className="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            Gérer les utilisateurs
          </button>
        </div>

        {/* Gestion des entreprises */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Gestion des entreprises</h2>
          </div>
          <p className="text-gray-600 mb-4">Gérez les clients et leurs informations</p>
          <button className="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            Gérer les entreprises
          </button>
        </div>

        {/* Paramètres */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Paramètres</h2>
          </div>
          <p className="text-gray-600 mb-4">Configurez les paramètres de l'application</p>
          <button className="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
            Accéder aux paramètres
          </button>
        </div>
      </div>
    </div>
  );
}