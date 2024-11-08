import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useTechnicians } from '../hooks/useTechnicians';

interface Technician {
  id: string;
  name: string;
  role: string;
  buyPrice?: number;
  sellPrice?: number;
}

interface AssignTechnicianModalProps {
  onAssign: (technicianData: any) => void;
  onCancel: () => void;
}

export default function AssignTechnicianModal({ onAssign, onCancel }: AssignTechnicianModalProps) {
  const { technicians } = useTechnicians();
  const [mainTechnician, setMainTechnician] = useState<Technician | null>(null);
  const [secondaryTechnicians, setSecondaryTechnicians] = useState<Technician[]>([]);
  const [error, setError] = useState<string | null>(null);

  const availableTechnicians = technicians.filter(tech => 
    tech.id !== mainTechnician?.id && 
    !secondaryTechnicians.some(st => st.id === tech.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainTechnician) {
      setError('Un technicien principal est requis');
      return;
    }

    try {
      onAssign({
        mainTechnician,
        secondaryTechnicians
      });
      onCancel();
    } catch (error) {
      setError('Erreur lors de l\'assignation des techniciens');
    }
  };

  const handleAddSecondaryTechnician = (technician: Technician) => {
    setSecondaryTechnicians(prev => [...prev, technician]);
  };

  const handleRemoveSecondaryTechnician = (techId: string) => {
    setSecondaryTechnicians(prev => prev.filter(tech => tech.id !== techId));
  };

  const handleMainTechnicianChange = (techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    if (tech) {
      setMainTechnician(tech);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Assigner les techniciens</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Technicien Principal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Technicien Principal
          </label>
          <select
            value={mainTechnician?.id || ''}
            onChange={(e) => handleMainTechnicianChange(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner un technicien</option>
            {availableTechnicians.map(tech => (
              <option key={tech.id} value={tech.id}>
                {tech.name} - {tech.role}
              </option>
            ))}
          </select>

          {mainTechnician?.role === 'SUBCONTRACTOR' && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix d'achat (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={mainTechnician.buyPrice || ''}
                  onChange={(e) => setMainTechnician({
                    ...mainTechnician,
                    buyPrice: parseFloat(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix de vente (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={mainTechnician.sellPrice || ''}
                  onChange={(e) => setMainTechnician({
                    ...mainTechnician,
                    sellPrice: parseFloat(e.target.value)
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Techniciens Secondaires */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Techniciens Secondaires
            </label>
            <select
              onChange={(e) => {
                const tech = technicians.find(t => t.id === e.target.value);
                if (tech) {
                  handleAddSecondaryTechnician(tech);
                }
                e.target.value = '';
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Ajouter un technicien</option>
              {availableTechnicians.map(tech => (
                <option key={tech.id} value={tech.id}>
                  {tech.name} - {tech.role}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            {secondaryTechnicians.map(tech => (
              <div key={tech.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium">{tech.name}</p>
                  <p className="text-sm text-gray-500">{tech.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSecondaryTechnician(tech.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
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
            Assigner
          </button>
        </div>
      </form>
    </div>
  );
}