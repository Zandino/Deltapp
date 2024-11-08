import React, { useState } from 'react';
import { Plus, Edit, Trash2, Building2, FileText } from 'lucide-react';
import { useModal } from '../hooks/useModal';
import Modal from '../components/Modal';
import { useClients } from '../hooks/useClients';
import { usePricing } from '../hooks/usePricing';
import PriceForm from '../components/PriceForm';
import ImportExportButton from '../components/ImportExportButton';

const priceTemplate = {
  clientId: 'ID du client',
  clientName: 'Nom du client',
  contractId: 'ID du contrat (optionnel)',
  serviceType: 'Type de service',
  description: 'Description du service',
  buyPrice: 'Prix d\'achat',
  sellPrice: 'Prix de vente',
  unit: 'hour/day/unit'
};

export default function PricingGrid() {
  const { prices, addPrice, updatePrice, deletePrice, importPrices } = usePricing();
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState<any | null>(null);
  const { clients } = useClients();

  const filteredPrices = selectedClient
    ? prices.filter(price => price.clientId === selectedClient)
    : prices;

  const handleAddPrice = async (data: any) => {
    try {
      await addPrice(data);
      setShowPriceForm(false);
    } catch (error) {
      console.error('Error adding price:', error);
    }
  };

  const handleEditPrice = async (data: any) => {
    try {
      await updatePrice(editingPrice.id, data);
      setEditingPrice(null);
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handleDeletePrice = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tarif ?')) {
      try {
        await deletePrice(id);
      } catch (error) {
        console.error('Error deleting price:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Grille tarifaire</h1>
        <div className="flex space-x-4">
          <select 
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Tous les clients</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.company}</option>
            ))}
          </select>
          <ImportExportButton
            onImport={importPrices}
            data={prices}
            filename="grille_tarifaire"
            template={priceTemplate}
          />
          <button
            onClick={() => setShowPriceForm(true)}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau tarif
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix d'achat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix de vente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unité
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrices.map((price) => (
                <tr key={price.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {price.clientName}
                        </div>
                        {price.contractName && (
                          <div className="text-sm text-gray-500">
                            {price.contractName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {price.serviceType}
                    </div>
                    {price.description && (
                      <div className="text-sm text-gray-500">
                        {price.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {price.buyPrice.toLocaleString('fr-FR')} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {price.sellPrice.toLocaleString('fr-FR')} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {price.unit === 'hour' ? 'Heure' : 
                       price.unit === 'day' ? 'Jour' : 'Unité'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingPrice(price)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePrice(price.id)}
                      className="text-red-600 hover:text-red-900"
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
        isOpen={showPriceForm || editingPrice !== null}
        onClose={() => {
          setShowPriceForm(false);
          setEditingPrice(null);
        }}
      >
        <PriceForm
          onSubmit={editingPrice ? handleEditPrice : handleAddPrice}
          onCancel={() => {
            setShowPriceForm(false);
            setEditingPrice(null);
          }}
          clients={clients}
          selectedClientId={selectedClient}
          initialData={editingPrice}
        />
      </Modal>
    </div>
  );
}