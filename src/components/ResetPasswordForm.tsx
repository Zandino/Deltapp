import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ResetPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  onClose: () => void;
}

export default function ResetPasswordForm({ onClose }: ResetPasswordFormProps) {
  const { user, resetPassword } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      if (!user?.email) {
        setError('Utilisateur non connecté');
        return;
      }

      await resetPassword(user.email, data.currentPassword, data.newPassword);
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Changer le mot de passe</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg text-sm">
          Mot de passe modifié avec succès
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mot de passe actuel
          </label>
          <input
            type="password"
            {...register('currentPassword', { required: 'Le mot de passe actuel est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            {...register('newPassword', {
              required: 'Le nouveau mot de passe est requis',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe
          </label>
          <input
            type="password"
            {...register('confirmPassword', {
              required: 'La confirmation du mot de passe est requise',
              validate: value => value === watch('newPassword') || 'Les mots de passe ne correspondent pas'
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
          Changer le mot de passe
        </button>
      </div>
    </form>
  );
}