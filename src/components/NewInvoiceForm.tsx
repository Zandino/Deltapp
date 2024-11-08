import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Transaction {
  id: string;
  date: string;
  amount: number;
}

interface NewInvoiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  monthlyTransactions: Transaction[];
}

export default function NewInvoiceForm({ onSubmit, onCancel, monthlyTransactions = [] }: NewInvoiceFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const selectedPeriod = watch('period');

  useEffect(() => {
    if (selectedPeriod && Array.isArray(monthlyTransactions)) {
      const totalAmount = monthlyTransactions
        .filter(t => t.date.startsWith(selectedPeriod))
        .reduce((sum, t) => sum + t.amount, 0);
      setValue('amount', totalAmount);
    }
  }, [selectedPeriod, monthlyTransactions, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Mettre à jour automatiquement le statut en "Envoyé" quand un fichier est sélectionné
      setValue('status', 'Envoyé');
    }
  };

  const onSubmitForm = (data: any) => {
    const formData = {
      ...data,
      status: selectedFile ? 'Envoyé' : 'En attente',
      attachment: selectedFile,
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Nouvelle Facture</h2>
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
            Période
          </label>
          <select
            {...register('period', { required: 'La période est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner une période...</option>
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - i);
              const value = format(date, 'yyyy-MM');
              const label = format(date, 'MMMM yyyy', { locale: fr });
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          {errors.period && (
            <p className="mt-1 text-sm text-red-600">{errors.period.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Numéro de facture
          </label>
          <input
            type="text"
            {...register('invoiceNumber', { required: 'Le numéro de facture est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="FACT-YYYY-MM"
          />
          {errors.invoiceNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Montant total (€)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { required: 'Le montant est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pièce jointe
          </label>
          <label className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  {selectedFile ? selectedFile.name : 'Sélectionner un fichier'}
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

        {/* Champ caché pour le statut */}
        <input type="hidden" {...register('status')} />
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
          Créer la facture
        </button>
      </div>
    </form>
  );
}