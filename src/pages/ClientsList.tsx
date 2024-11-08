import React, { useState } from 'react';
import { Plus, Building2, Phone, Mail, MapPin, Edit, Trash2, FileText } from 'lucide-react';
import { useClients } from '../hooks/useClients';
import { ClientForm } from '../components/ClientForm';
import Modal from '../components/Modal';
import ImportExportButton from '../components/ImportExportButton';
import ClientInterventions from '../components/ClientInterventions';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

const clientTemplate = {
  name: 'Nom du contact',
  company: 'Nom de l\'entreprise',
  email: 'email@example.com',
  phone: '0123456789',
  address: '123 rue Example',
  city: 'Ville',
  postalCode: '12345'
};

export default function ClientsList() {
  const { clients, addClient, updateClient, deleteClient, importClients } = useClients();
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, data);
        setEditingClient(null);
      } else {
        await addClient(data);
        setShowNewClientModal(false);
      }
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await deleteClient(id);
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleViewInterventions = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Liste des clients</h1>
        <div className="flex space-x-4">
          <ImportExportButton
            onImport={importClients}
            data={clients}
            filename="clients"
            template={clientTemplate}
          />
          <button
            onClick={() => setShowNewClientModal(true)}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau client
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coordonnées
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {client.company}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        {client.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {client.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {client.address}, {client.postalCode} {client.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewInterventions(client.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Voir les interventions"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setEditingClient(client)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Modifier"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showNewClientModal || editingClient !== null}
        onClose={() => {
          setShowNewClientModal(false);
          setEditingClient(null);
        }}
      >
        <ClientForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowNewClientModal(false);
            setEditingClient(null);
          }}
          initialData={editingClient || undefined}
        />
      </Modal>

      <Modal
        isOpen={selectedClientId !== null}
        onClose={() => setSelectedClientId(null)}
      >
        {selectedClientId && (
          <ClientInterventions
            clientId={selectedClientId}
            onClose={() => setSelectedClientId(null)}
          />
        )}
      </Modal>
    </div>
  );
}