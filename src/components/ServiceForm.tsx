import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';

interface ServiceFormProps {
  contractId: string;
  initialData?: any;
  onClose: () => void;
}

export default function ServiceForm({ contractId, initialData, onClose }: ServiceFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      unit: 'HOUR'
    }
  });

  const { addService, updateService } = useContracts();

  const onSubmit = async (data: any) => {
    try {
      if (initialData) {
        await updateService(initialData.id, data);
      } else {
        await addService(contractId, data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Modifier le service' : 'Nouveau service'}
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
            Nom du service
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
            Description
          </label>
          <textarea
            {...register('description', { required: 'La description est requise' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Le prix doit être positif' }
                })}
                className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unité
            </label>
            <select
              {...register('unit', { required: 'L\'unité est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="HOUR">Heure</option>
              <option value="DAY">Jour</option>
              <option value="UNIT">Unité</option>
            </select>
            {errors.unit && (
              <p className="mt-1 text-sm text-red-600">{errors.unit.message as string}</p>
            )}
          </div>
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
          {initialData ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}