import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { validateTrackingNumber } from '../lib/tracking';

interface TrackingNumberInputProps {
  onAdd: (trackingNumber: string) => void;
}

export default function TrackingNumberInput({ onAdd }: TrackingNumberInputProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!trackingNumber.trim()) {
      setError('Veuillez entrer un numéro de suivi');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const result = await validateTrackingNumber(trackingNumber);
      
      if (result.isValid) {
        onAdd(trackingNumber);
        setTrackingNumber('');
      } else {
        setError(result.message || 'Numéro de suivi invalide');
      }
    } catch (err) {
      setError('Erreur lors de la validation');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Entrez un numéro de suivi"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={isValidating}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isValidating ? (
            <span className="inline-block animate-spin">⌛</span>
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}