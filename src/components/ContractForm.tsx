import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';
import { useClients } from '../hooks/useClients';

interface ContractFormProps {
  mode?: 'create' | 'edit';
  initialData?: any;
  onClose: () => void;
}

export default function ContractForm({ mode = 'create', initialData, onClose }: ContractFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      type: 'MAINTENANCE',
      status: 'ACTIVE'
    }
  });

  const { addContract, updateContract } = useContracts();
  const { clients } = useClients();

  const onSubmit = async (data: any) => {
    try {
      const client = clients.find(c => c.id === data.clientId);
      if (!client) throw new Error('Client not found');

      const contractData = {
        ...data,
        clientName: client.company
      };

      if (mode === 'create') {
        await addContract(contractData);
      } else {
        await updateContract(initialData.id, contractData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving contract:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {mode === 'create' ? 'Nouveau contrat' : 'Modifier le contrat'}
        </h2>
        <button
          type="button"
          onClick={onClose}
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
            disabled={mode === 'edit'}
          >
            <option value="">Sélectionner un client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.company}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du contrat
          </label>
          <input
            type="text"
            {...register('name', { required: 'Le nom est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de contrat
          </label>
          <select
            {...register('type', { required: 'Le type est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="MAINTENANCE">Maintenance</option>
            <option value="SUPPORT">Support</option>
            <option value="PROJECT">Projet</option>
            <option value="INTERVENTION">Intervention</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message as string}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de début
            </label>
            <input
              type="date"
              {...register('startDate', { required: 'La date de début est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de fin
            </label>
            <input
              type="date"
              {...register('endDate', { required: 'La date de fin est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message as string}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            {...register('status', { required: 'Le statut est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="ACTIVE">Actif</option>
            <option value="EXPIRED">Expiré</option>
            <option value="CANCELLED">Annulé</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {mode === 'create' ? 'Créer' : 'Mettre à jour'}
        </button>
      </div>
    </form>
  );
}