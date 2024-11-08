import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ScrollText } from 'lucide-react';

export default function Clients() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clients</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/clients/list')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Liste des clients</h2>
              <p className="text-gray-500">Gérer les clients et leurs informations</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/clients/contracts')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <ScrollText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Contrats</h2>
              <p className="text-gray-500">Gérer les contrats clients</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/clients/pricing-grid')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Grille tarifaire</h2>
              <p className="text-gray-500">Gérer les tarifs par client</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}