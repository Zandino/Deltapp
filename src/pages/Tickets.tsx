import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useInterventions } from '../hooks/useInterventions';
import { useAuth } from '../hooks/useAuth';
import InterventionsTable from '../components/InterventionsTable';
import NewInterventionForm from '../components/NewInterventionForm';
import Modal from '../components/Modal';
import InterventionDetails from '../components/InterventionDetails';
import CloseInterventionForm from '../components/CloseInterventionForm';
import AssignTechnicianModal from '../components/AssignTechnicianModal';

export default function Tickets() {
  const { interventions = [], addIntervention, updateIntervention, deleteIntervention, duplicateIntervention, fetchInterventions, resetIds } = useInterventions();
  const { user } = useAuth();
  const [showNewIntervention, setShowNewIntervention] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);
  const [editingIntervention, setEditingIntervention] = useState<string | null>(null);
  const [closingIntervention, setClosingIntervention] = useState<string | null>(null);
  const [assigningIntervention, setAssigningIntervention] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInterventions();
    resetIds();
  }, [fetchInterventions, resetIds]);

  const canCreateIntervention = user?.role === 'ADMIN' || user?.role === 'DISPATCHER';

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await addIntervention(data);
      setShowNewIntervention(false);
    } catch (error) {
      console.error('Error creating intervention:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors de la création de l\'intervention');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingIntervention) return;
    try {
      setIsSubmitting(true);
      setError(null);
      await updateIntervention(editingIntervention, data);
      setEditingIntervention(null);
    } catch (error) {
      console.error('Error updating intervention:', error);
      setError('Erreur lors de la modification de l\'intervention');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleView = (id: string) => {
    setSelectedIntervention(id);
  };

  const handleEditClick = (id: string) => {
    setEditingIntervention(id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
      try {
        setError(null);
        await deleteIntervention(id);
      } catch (error) {
        setError('Erreur lors de la suppression de l\'intervention');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setError(null);
      await duplicateIntervention(id);
    } catch (error) {
      setError('Erreur lors de la duplication de l\'intervention');
    }
  };

  const handleAssignTechnician = async (interventionId: string, technicianData: any) => {
    try {
      setError(null);
      await updateIntervention(interventionId, {
        technicians: technicianData.mainTechnician ? [
          { ...technicianData.mainTechnician, role: 'primary' },
          ...technicianData.secondaryTechnicians.map((tech: any) => ({ ...tech, role: 'secondary' }))
        ] : [],
        status: 'in_progress'
      });
      setAssigningIntervention(null);
    } catch (error) {
      console.error('Error assigning technician:', error);
      setError('Erreur lors de l\'assignation du technicien');
    }
  };

  const handleCloseIntervention = async (id: string, closureData: any) => {
    try {
      setError(null);
      await updateIntervention(id, {
        status: 'completed',
        closureData
      });
      setClosingIntervention(null);
    } catch (error) {
      console.error('Error closing intervention:', error);
      setError('Erreur lors de la clôture de l\'intervention');
    }
  };

  const filteredInterventions = interventions.filter(intervention => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      intervention.title?.toLowerCase().includes(searchLower) ||
      intervention.client?.toLowerCase().includes(searchLower) ||
      intervention.siteName?.toLowerCase().includes(searchLower) ||
      intervention.id?.includes(searchLower);

    if (user?.role === 'TECHNICIAN' || user?.role === 'SUBCONTRACTOR') {
      return matchesSearch && (
        intervention.technicians?.some(tech => tech.id === user.id)
      );
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        {canCreateIntervention && (
          <button
            onClick={() => setShowNewIntervention(true)}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau ticket
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, client, site ou ID..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredInterventions.length} résultat(s) trouvé(s)
            </p>
          )}
        </div>

        <InterventionsTable
          interventions={filteredInterventions}
          onView={handleView}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onAssignTechnician={canCreateIntervention ? (id) => setAssigningIntervention(id) : undefined}
          onClose={(id) => setClosingIntervention(id)}
        />
      </div>

      {showNewIntervention && (
        <Modal
          isOpen={showNewIntervention}
          onClose={() => setShowNewIntervention(false)}
        >
          <NewInterventionForm
            onSubmit={handleSubmit}
            onCancel={() => setShowNewIntervention(false)}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {selectedIntervention && (
        <Modal
          isOpen={!!selectedIntervention}
          onClose={() => setSelectedIntervention(null)}
        >
          <InterventionDetails
            intervention={interventions.find(i => i.id === selectedIntervention)!}
            onClose={() => setSelectedIntervention(null)}
          />
        </Modal>
      )}

      {editingIntervention && (
        <Modal
          isOpen={!!editingIntervention}
          onClose={() => setEditingIntervention(null)}
        >
          <NewInterventionForm
            onSubmit={handleEdit}
            onCancel={() => setEditingIntervention(null)}
            initialData={interventions.find(i => i.id === editingIntervention)}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}

      {assigningIntervention && (
        <Modal
          isOpen={!!assigningIntervention}
          onClose={() => setAssigningIntervention(null)}
        >
          <AssignTechnicianModal
            onAssign={(technicianData) => handleAssignTechnician(assigningIntervention, technicianData)}
            onCancel={() => setAssigningIntervention(null)}
          />
        </Modal>
      )}

      {closingIntervention && (
        <Modal
          isOpen={!!closingIntervention}
          onClose={() => setClosingIntervention(null)}
        >
          <CloseInterventionForm
            intervention={interventions.find(i => i.id === closingIntervention)!}
            onSubmit={(data) => handleCloseIntervention(closingIntervention, data)}
            onCancel={() => setClosingIntervention(null)}
          />
        </Modal>
      )}
    </div>
  );
}