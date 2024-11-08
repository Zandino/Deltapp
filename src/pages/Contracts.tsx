import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';
import ContractList from '../components/ContractList';
import ContractForm from '../components/ContractForm';
import Modal from '../components/Modal';
import ImportExportButton from '../components/ImportExportButton';

const contractTemplate = {
  name: 'Nom du contrat',
  type: 'MAINTENANCE/SUPPORT/PROJECT/INTERVENTION',
  clientId: 'ID du client',
  startDate: 'YYYY-MM-DD',
  endDate: 'YYYY-MM-DD',
  status: 'ACTIVE/EXPIRED/CANCELLED'
};

export default function Contracts() {
  const [showNewContract, setShowNewContract] = useState(false);
  const { contracts, importContracts } = useContracts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contrats</h1>
        <div className="flex space-x-4">
          <ImportExportButton
            onImport={importContracts}
            data={contracts}
            filename="contrats"
            template={contractTemplate}
          />
          <button
            onClick={() => setShowNewContract(true)}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau contrat
          </button>
        </div>
      </div>

      <ContractList contracts={contracts} />

      <Modal
        isOpen={showNewContract}
        onClose={() => setShowNewContract(false)}
      >
        <ContractForm
          onClose={() => setShowNewContract(false)}
        />
      </Modal>
    </div>
  );
}