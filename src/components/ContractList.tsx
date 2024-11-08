import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Edit, Trash2, Plus } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';
import { useModal } from '../hooks/useModal';
import ContractForm from './ContractForm';
import ServiceForm from './ServiceForm';
import Modal from './Modal';

export default function ContractList() {
  const { contracts, deleteContract } = useContracts();
  const { openModal, closeModal } = useModal();
  const [selectedContractId, setSelectedContractId] = React.useState<string | null>(null);
  const [showServiceForm, setShowServiceForm] = React.useState(false);

  const handleEditContract = (contract: any) => {
    openModal(
      <ContractForm
        mode="edit"
        initialData={contract}
        onClose={closeModal}
      />
    );
  };

  const handleAddService = (contractId: string) => {
    setSelectedContractId(contractId);
    setShowServiceForm(true);
  };

  const handleDeleteContract = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      await deleteContract(id);
    }
  };

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div key={contract.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{contract.name}</h3>
              <p className="text-sm text-gray-500">{contract.clientName}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditContract(contract)}
                className="text-blue-600 hover:text-blue-800"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeleteContract(contract.id)}
                className="text-red-600 hover:text-red-800"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{contract.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de début</p>
              <p className="font-medium">
                {format(new Date(contract.startDate), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de fin</p>
              <p className="font-medium">
                {contract.endDate ? format(new Date(contract.endDate), 'dd MMMM yyyy', { locale: fr }) : '-'}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Services</h4>
              <button
                onClick={() => handleAddService(contract.id)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter un service
              </button>
            </div>
            
            <div className="space-y-2">
              {contract.services?.map((service) => (
                <div
                  key={service.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="font-medium">{service.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 ml-6">{service.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {service.price.toLocaleString('fr-FR')} € / {service.unit === 'HOUR' ? 'heure' : service.unit === 'DAY' ? 'jour' : 'unité'}
                    </p>
                  </div>
                </div>
              ))}

              {(!contract.services || contract.services.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Aucun service ajouté à ce contrat
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {contracts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun contrat trouvé</p>
        </div>
      )}

      {/* Modal pour ajouter un service */}
      <Modal
        isOpen={showServiceForm}
        onClose={() => setShowServiceForm(false)}
      >
        <ServiceForm
          contractId={selectedContractId!}
          onClose={() => setShowServiceForm(false)}
        />
      </Modal>
    </div>
  );
}