import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

interface ProjectFormProps {
  mode?: 'create' | 'edit';
  initialData?: any;
  onClose: () => void;
}

export default function ProjectForm({ mode = 'create', initialData, onClose }: ProjectFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      status: 'PLANNED'
    }
  });

  const { addProject, updateProject } = useProjects();

  const onSubmit = async (data: any) => {
    try {
      if (mode === 'create') {
        await addProject(data);
      } else {
        await updateProject(initialData.id, data);
      }
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {mode === 'create' ? 'Nouveau projet' : 'Modifier le projet'}
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
            Nom du projet
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
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client
          </label>
          <input
            type="text"
            {...register('clientName', { required: 'Le client est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-600">{errors.clientName.message as string}</p>
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
              Date de fin (optionnelle)
            </label>
            <input
              type="date"
              {...register('endDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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
            <option value="PLANNED">Planifié</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminé</option>
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