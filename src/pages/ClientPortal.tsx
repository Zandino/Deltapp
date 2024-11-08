import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInterventions } from '../hooks/useInterventions';
import NewInterventionForm from '../components/NewInterventionForm';
import Modal from '../components/Modal';

export default function ClientPortal() {
  const [showNewIntervention, setShowNewIntervention] = useState(false);
  const { user } = useAuth();
  const { interventions, addIntervention } = useInterventions();

  // Filter interventions for this client
  const clientInterventions = interventions.filter(
    (intervention) => intervention.client === user?.company
  );

  const handleSubmit = async (data: any) => {
    try {
      // Add client information automatically
      const interventionData = {
        ...data,
        client: user?.company,
        clientId: user?.id
      };
      await addIntervention(interventionData);
      setShowNewIntervention(false);
    } catch (error) {
      console.error('Error creating intervention:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portail Client</h1>
              <p className="mt-1 text-sm text-gray-500">{user?.company}</p>
            </div>
            <button
              onClick={() => setShowNewIntervention(true)}
              className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle demande
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">En attente</h2>
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {clientInterventions.filter(i => i.status === 'pending').length}
              </span>
            </div>
            <div className="space-y-4">
              {clientInterventions
                .filter(i => i.status === 'pending')
                .map(intervention => (
                  <div key={intervention.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-medium">{intervention.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {intervention.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">En cours</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {clientInterventions.filter(i => i.status === 'in_progress').length}
              </span>
            </div>
            <div className="space-y-4">
              {clientInterventions
                .filter(i => i.status === 'in_progress')
                .map(intervention => (
                  <div key={intervention.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-medium">{intervention.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {intervention.description}
                        </p>
                        {intervention.technicianName && (
                          <p className="text-sm text-blue-600 mt-2">
                            Technicien: {intervention.technicianName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Terminées</h2>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {clientInterventions.filter(i => i.status === 'completed').length}
              </span>
            </div>
            <div className="space-y-4">
              {clientInterventions
                .filter(i => i.status === 'completed')
                .map(intervention => (
                  <div key={intervention.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <div>
                        <h3 className="font-medium">{intervention.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {intervention.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>

      <Modal
        isOpen={showNewIntervention}
        onClose={() => setShowNewIntervention(false)}
      >
        <NewInterventionForm
          onSubmit={handleSubmit}
          onCancel={() => setShowNewIntervention(false)}
        />
      </Modal>
    </div>
  );
}