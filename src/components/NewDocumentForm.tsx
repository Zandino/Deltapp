import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { addYears, format } from 'date-fns';

interface AdminDocument {
  id: string;
  type: 'KBIS' | 'ASSURANCE' | 'CONTRAT' | 'URSSAF' | 'IMPOT';
  name: string;
  expiryDate: string;
  file?: string;
  status: string;
}

interface NewDocumentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isUpdate?: boolean;
  currentDocument?: AdminDocument;
}

const documentTypes = [
  { value: 'KBIS', label: 'KBIS' },
  { value: 'ASSURANCE', label: 'Assurance' },
  { value: 'CONTRAT', label: 'Contrat' },
  { value: 'URSSAF', label: 'URSSAF' },
  { value: 'IMPOT', label: 'Impôt' }
];

export default function NewDocumentForm({ onSubmit, onCancel, isUpdate = false, currentDocument }: NewDocumentFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (isUpdate && currentDocument) {
      reset({
        type: currentDocument.type,
        name: currentDocument.name,
        expiryDate: format(new Date(currentDocument.expiryDate), 'yyyy-MM-dd')
      });
    }
  }, [isUpdate, currentDocument, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmitForm = (data: any) => {
    const formData = {
      ...data,
      file: selectedFile,
      expiryDate: data.expiryDate
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {isUpdate ? 'Mise à jour du document' : 'Nouveau document administratif'}
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
        {isUpdate ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de document
              </label>
              <input
                type="text"
                value={currentDocument?.type}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du document
              </label>
              <input
                type="text"
                value={currentDocument?.name}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                disabled
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de document
              </label>
              <select
                {...register('type', { required: 'Le type de document est requis' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Sélectionner un type...</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du document
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
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouvelle date d'expiration
          </label>
          <input
            type="date"
            {...register('expiryDate', { required: 'La date d\'expiration est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min={format(new Date(), 'yyyy-MM-dd')}
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nouveau document
          </label>
          <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  {selectedFile ? selectedFile.name : 'Sélectionner un nouveau fichier'}
                </span>
              </div>
              <p className="text-xs text-gray-500">PDF jusqu'à 10MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </label>
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
          {isUpdate ? 'Mettre à jour' : 'Ajouter le document'}
        </button>
      </div>
    </form>
  );
}