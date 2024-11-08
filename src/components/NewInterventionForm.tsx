import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, MapPin, Plus } from 'lucide-react';
import { useGeocoding } from '../hooks/useGeocoding';
import { FileUpload } from './FileUpload';
import { useClients } from '../hooks/useClients';
import TechnicianSelect from './TechnicianSelect';
import type { InterventionInput } from '../types/intervention';

interface NewInterventionFormProps {
  onSubmit: (data: InterventionInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: any;
}

export default function NewInterventionForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  initialData
}: NewInterventionFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      duration: 1,
      trackingNumbers: [],
      technicians: [],
      expenses: [],
      buyPrice: 0,
      sellPrice: 0,
      location: {
        address: '',
        city: '',
        postalCode: '',
        latitude: 0,
        longitude: 0
      }
    }
  });

  const { geocodeAddress } = useGeocoding();
  const { clients } = useClients();
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>(initialData?.trackingNumbers || []);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [technicians, setTechnicians] = useState(initialData?.technicians || []);
  const [expenses, setExpenses] = useState(initialData?.expenses || []);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddTrackingNumber = () => {
    if (newTrackingNumber.trim()) {
      setTrackingNumbers([...trackingNumbers, newTrackingNumber.trim()]);
      setNewTrackingNumber('');
    }
  };

  const handleRemoveTrackingNumber = (index: number) => {
    setTrackingNumbers(trackingNumbers.filter((_, i) => i !== index));
  };

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleTechnicianChange = (technicians: any[], expenses: any[]) => {
    setTechnicians(technicians);
    setExpenses(expenses);
  };

  const onSubmitForm = async (data: any) => {
    try {
      setFormError(null);

      if (!data.title || !data.description || !data.date || !data.time || !data.clientId || !data.siteName) {
        setFormError('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const locationData = await geocodeAddress(
        `${data.location.address}, ${data.location.city} ${data.location.postalCode}`
      );

      if (!locationData) {
        setFormError('Impossible de géolocaliser l\'adresse');
        return;
      }

      const formData = {
        ...data,
        location: locationData,
        trackingNumbers,
        attachments: selectedFiles,
        technicians,
        expenses,
        buyPrice: parseFloat(data.buyPrice?.toString() || '0'),
        sellPrice: parseFloat(data.sellPrice?.toString() || '0')
      };

      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Modifier le ticket' : 'Nouveau ticket d\'intervention'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {formError}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type d'intervention *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Le type d\'intervention est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ex: Installation serveur, Maintenance réseau..."
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'La description est requise' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Décrivez l'intervention à réaliser..."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <input
              type="date"
              {...register('date', { required: 'La date est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heure *
            </label>
            <input
              type="time"
              {...register('time', { required: 'L\'heure est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Client *
          </label>
          <select
            {...register('clientId', { required: 'Le client est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Sélectionner un client...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.company} - {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Site d'intervention *
          </label>
          <input
            type="text"
            {...register('siteName', { required: 'Le nom du site est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Nom du site"
            disabled={isSubmitting}
          />
          {errors.siteName && (
            <p className="mt-1 text-sm text-red-600">{errors.siteName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix d'achat (€)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('buyPrice')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prix de vente (€)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('sellPrice')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Techniciens
          </label>
          <TechnicianSelect
            value={technicians}
            onChange={handleTechnicianChange}
            expenses={expenses}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse *
            </label>
            <input
              type="text"
              {...register('location.address', { required: 'L\'adresse est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Numéro et nom de rue"
              disabled={isSubmitting}
            />
            {errors.location?.address && (
              <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Code postal *
              </label>
              <input
                type="text"
                {...register('location.postalCode', { required: 'Le code postal est requis' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              {errors.location?.postalCode && (
                <p className="mt-1 text-sm text-red-600">{errors.location.postalCode.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ville *
              </label>
              <input
                type="text"
                {...register('location.city', { required: 'La ville est requise' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              {errors.location?.city && (
                <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Numéros de suivi
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              value={newTrackingNumber}
              onChange={(e) => setNewTrackingNumber(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ajouter un numéro de suivi"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={handleAddTrackingNumber}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {trackingNumbers.length > 0 && (
            <div className="mt-2 space-y-2">
              {trackingNumbers.map((number, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <span>{number}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrackingNumber(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pièces jointes
          </label>
          <FileUpload onFilesSelected={handleFilesSelected} />
          {selectedFiles.length > 0 && (
            <div className="mt-2 space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer le ticket'}
        </button>
      </div>
    </form>
  );
}