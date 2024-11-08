import React from 'react';
import { Euro } from 'lucide-react';

interface PriceFieldsProps {
  onSubmit?: (data: { buyPrice: number; sellPrice?: number }) => void;
  onCancel: () => void;
  showBuyPriceOnly?: boolean;
  required?: boolean;
  initialValues?: {
    buyPrice?: number;
    sellPrice?: number;
  };
  errors?: {
    buyPrice?: string;
    sellPrice?: string;
  };
  register: any;
}

export default function PriceFields({ 
  onCancel, 
  showBuyPriceOnly = false,
  required = false,
  errors,
  register
}: PriceFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prix d'achat (€)
        </label>
        <div className="mt-1 relative">
          <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="number"
            step="0.01"
            {...register('buyPrice', {
              required: required ? 'Le prix d\'achat est requis' : false,
              min: { value: 0, message: 'Le prix doit être positif' }
            })}
            className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {errors?.buyPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.buyPrice}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prix de vente (€)
        </label>
        <div className="mt-1 relative">
          <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="number"
            step="0.01"
            {...register('sellPrice', {
              required: required ? 'Le prix de vente est requis' : false,
              min: { value: 0, message: 'Le prix doit être positif' }
            })}
            className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {errors?.sellPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.sellPrice}</p>
        )}
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
          Valider
        </button>
      </div>
    </div>
  );
}