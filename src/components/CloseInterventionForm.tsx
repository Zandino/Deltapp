import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Trash2, Plus } from 'lucide-react';
import SignaturePad from './SignaturePad';
import type { Intervention } from '../hooks/useInterventions';

interface Material {
  designation: string;
  serialNumber: string;
}

interface FormData {
  completionNotes: string;
  arrivalTime: string;
  departureTime: string;
  signatoryName: string;
  signature: string;
  attachments: File[];
  materials: Material[];
  needsFollowUp: boolean;
  followUpNotes?: string;
  nextSteps: string;
}

interface CloseInterventionFormProps {
  intervention: Intervention;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function CloseInterventionForm({ 
  intervention, 
  onSubmit, 
  onCancel 
}: CloseInterventionFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      completionNotes: '',
      arrivalTime: '',
      departureTime: '',
      signatoryName: '',
      signature: '',
      attachments: [],
      materials: [],
      needsFollowUp: false,
      followUpNotes: '',
      nextSteps: ''
    }
  });

  const [materials, setMaterials] = useState<Material[]>([]);
  const [newMaterial, setNewMaterial] = useState<Material>({ designation: '', serialNumber: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachments = watch('attachments') || [];
  const needsFollowUp = watch('needsFollowUp');

  const handleSignatureEnd = (signatureData: string) => {
    setValue('signature', signatureData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setValue('attachments', [...attachments, ...files]);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setValue('attachments', newAttachments);
  };

  const addMaterial = () => {
    if (newMaterial.designation && newMaterial.serialNumber) {
      setMaterials([...materials, newMaterial]);
      setValue('materials', [...materials, newMaterial]);
      setNewMaterial({ designation: '', serialNumber: '' });
    }
  };

  const removeMaterial = (index: number) => {
    const newMaterials = [...materials];
    newMaterials.splice(index, 1);
    setMaterials(newMaterials);
    setValue('materials', newMaterials);
  };

  const handleFormSubmit = async (data: FormData) => {
    const formData = {
      ...data,
      materials,
      needsFollowUp: data.needsFollowUp,
      followUpNotes: data.needsFollowUp ? data.followUpNotes : undefined
    };

    await onSubmit(formData);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Clôturer l'intervention</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Affichage des techniciens */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium mb-3">Techniciens de l'intervention</h3>
        <div className="space-y-3">
          {intervention.technicians?.map((tech, index) => (
            <div 
              key={index} 
              className="flex justify-between items-start p-2 bg-gray-50 rounded-md"
            >
              <div>
                <p className="font-medium">{tech.name}</p>
                <p className="text-sm text-gray-500">
                  {tech.isSubcontractor ? 'Sous-traitant' : 'Technicien'}
                </p>
              </div>
              {tech.isSubcontractor && (
                <div className="text-sm text-gray-600">
                  <p>Achat: {tech.buyPrice}€</p>
                  <p>Vente: {tech.sellPrice}€</p>
                </div>
              )}
            </div>
          ))}
          
          {(!intervention.technicians || intervention.technicians.length === 0) && (
            <p className="text-sm text-gray-500 text-center py-2">
              Aucun technicien assigné
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description de l'intervention
          </label>
          <textarea
            {...register('completionNotes', { required: 'La description est requise' })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Décrivez le travail effectué..."
          />
          {errors.completionNotes && (
            <p className="mt-1 text-sm text-red-600">{errors.completionNotes.message}</p>
          )}
        </div>

        {/* Heures */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heure d'arrivée
            </label>
            <input
              type="time"
              {...register('arrivalTime', { required: 'L\'heure d\'arrivée est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.arrivalTime && (
              <p className="mt-1 text-sm text-red-600">{errors.arrivalTime.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Heure de départ
            </label>
            <input
              type="time"
              {...register('departureTime', { required: 'L\'heure de départ est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.departureTime && (
              <p className="mt-1 text-sm text-red-600">{errors.departureTime.message}</p>
            )}
          </div>
        </div>

        {/* Matériel utilisé */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Matériel utilisé
          </label>
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMaterial.designation}
                onChange={(e) => setNewMaterial({ ...newMaterial, designation: e.target.value })}
                placeholder="Désignation"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newMaterial.serialNumber}
                onChange={(e) => setNewMaterial({ ...newMaterial, serialNumber: e.target.value })}
                placeholder="Numéro de série"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addMaterial}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {materials.length > 0 && (
              <div className="space-y-2">
                {materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <span className="text-sm">{material.designation}</span>
                      <span className="text-sm text-gray-500">{material.serialNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Suivi nécessaire */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('needsFollowUp')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Intervention non concluante - Nécessite un suivi
            </label>
          </div>

          {needsFollowUp && (
            <div>
              <textarea
                {...register('followUpNotes', {
                  required: needsFollowUp ? 'Les notes de suivi sont requises' : false
                })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Décrivez pourquoi un suivi est nécessaire..."
              />
              {errors.followUpNotes && (
                <p className="mt-1 text-sm text-red-600">{errors.followUpNotes.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Pièces jointes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos et pièces jointes
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Ajouter des fichiers</span>
                  <input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    className="sr-only"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
            </div>
          </div>

          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signature */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du signataire
          </label>
          <input
            type="text"
            {...register('signatoryName', { required: 'Le nom du signataire est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Nom et prénom du signataire"
          />
          {errors.signatoryName && (
            <p className="mt-1 text-sm text-red-600">{errors.signatoryName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature
          </label>
          <SignaturePad onEnd={handleSignatureEnd} />
          {errors.signature && (
            <p className="mt-1 text-sm text-red-600">{errors.signature.message}</p>
          )}
        </div>

        {/* Boutons */}
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
            Clôturer
          </button>
        </div>
      </form>
    </div>
  );
}