import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { UserRole } from '../types/user';

interface NewUserFormData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  company?: string;
}

interface NewUserFormProps {
  onSubmit: (data: NewUserFormData) => void;
  onCancel: () => void;
}

export default function NewUserForm({ onSubmit, onCancel }: NewUserFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<NewUserFormData>();

  const handleFormSubmit = async (data: NewUserFormData) => {
    try {
      // Ajouter un mot de passe par défaut
      const userData = {
        ...data,
        password: 'changeme123',
        isActive: true
      };
      await onSubmit(userData);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const roles: { value: UserRole; label: string }[] = [
    { value: 'DISPATCHER', label: 'Dispatcher' },
    { value: 'TECHNICIAN', label: 'Technicien' },
    { value: 'SUBCONTRACTOR', label: 'Sous-traitant' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ajouter un utilisateur</h2>
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
            Nom complet
          </label>
          <input
            type="text"
            {...register('name', { required: 'Le nom est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            {...register('phone', { required: 'Le téléphone est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rôle
          </label>
          <select
            {...register('role', { required: 'Le rôle est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner un rôle</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Entreprise (optionnel)
          </label>
          <input
            type="text"
            {...register('company')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
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
          Ajouter
        </button>
      </div>
    </form>
  );
}