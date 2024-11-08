import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, FolderKanban } from 'lucide-react';

export default function Interventions() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Interventions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/tickets')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Ticket className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Tickets</h2>
              <p className="text-gray-500">Gérer les tickets d'intervention</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/projects')}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FolderKanban className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Projets</h2>
              <p className="text-gray-500">Gérer les projets d'intervention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}