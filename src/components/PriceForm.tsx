import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';

interface Client {
  id: string;
  company: string;
}

interface Contract {
  id: string;
  name: string;
  clientId: string;
}

interface PriceFormData {
  clientId: string;
  contractId?: string;
  serviceType: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  unit: 'hour' | 'day' | 'unit';
}

interface PriceFormProps {
  onSubmit: (data: PriceFormData) => Promise<void>;
  onCancel: () => void;
  clients: Client[];
  selectedClientId?: string;
  initialData?: Partial<PriceFormData>;
}

export default function PriceForm({ 
  onSubmit, 
  onCancel, 
  clients,
  selectedClientId: defaultClientId,
  initialData 
}: PriceFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PriceFormData>({
    defaultValues: {
      ...initialData,
      clientId: defaultClientId || initialData?.clientId || '',
      unit: initialData?.unit || 'hour'
    }
  });

  const { contracts } = useContracts();
  const [availableContracts, setAvailableContracts] = useState<Contract[]>([]);
  const selectedClientId = watch('clientId');

  useEffect(() => {
    if (selectedClientId) {
      const clientContracts = contracts.filter(
        contract => contract.clientId === selectedClientId && contract.status === 'ACTIVE'
      );
      setAvailableContracts(clientContracts);
    } else {
      setAvailableContracts([]);
    }
  }, [selectedClientId, contracts]);

  const handleFormSubmit = async (data: PriceFormData) => {
    try {
      const client = clients.find(c => c.id === data.clientId);
      const contract = data.contractId ? availableContracts.find(c => c.id === data.contractId) : undefined;

      const priceData = {
        ...data,
        clientName: client?.company || '',
        contractName: contract?.name
      };

      await onSubmit(priceData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Modifier le tarif' : 'Nouveau tarif'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <select
            {...register('clientId', { required: 'Le client est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner un client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.company}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contrat (optionnel)
          </label>
          <select
            {...register('contractId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={!selectedClientId}
          >
            <option value="">Sélectionner un contrat...</option>
            {availableContracts.map(contract => (
              <option key={contract.id} value={contract.id}>
                {contract.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de service
          </label>
          <input
            type="text"
            {...register('serviceType', { required: 'Le type de service est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix d'achat (€)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('buyPrice', {
                required: 'Le prix d\'achat est requis',
                min: { value: 0, message: 'Le prix doit être positif' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.buyPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.buyPrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix de vente (€)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('sellPrice', {
                required: 'Le prix de vente est requis',
                min: { value: 0, message: 'Le prix doit être positif' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.sellPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.sellPrice.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unité
          </label>
          <select
            {...register('unit')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="hour">Heure</option>
            <option value="day">Jour</option>
            <option value="unit">Unité</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}