import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTechnicians } from '../hooks/useTechnicians';
import type { TechnicianAssignment } from '../types/intervention';

interface TechnicianSelectProps {
  value: TechnicianAssignment[];
  onChange: (technicians: TechnicianAssignment[], expenses: any[]) => void;
  expenses: any[];
  error?: string;
}

export default function TechnicianSelect({ value, onChange, expenses, error }: TechnicianSelectProps) {
  const { technicians } = useTechnicians();
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'primary' | 'secondary'>('secondary');
  const [tempPrices, setTempPrices] = useState({ buyPrice: 0, sellPrice: 0 });
  
  const handleAddTechnician = (techId: string, role: 'primary' | 'secondary') => {
    const tech = technicians.find(t => t.id === techId);
    if (!tech) return;

    const isSubcontractor = tech.role === 'SUBCONTRACTOR';

    if (isSubcontractor) {
      setSelectedTechId(techId);
      setSelectedRole(role);
      setShowPriceModal(true);
      return;
    }

    addTechnicianToList(techId, role);
  };

  const addTechnicianToList = (techId: string, role: 'primary' | 'secondary', prices?: { buyPrice?: number; sellPrice?: number }) => {
    const tech = technicians.find(t => t.id === techId);
    if (!tech) return;

    const isSubcontractor = tech.role === 'SUBCONTRACTOR';

    const newTech: TechnicianAssignment = {
      id: tech.id,
      name: tech.name,
      role,
      isSubcontractor,
      ...prices
    };

    let newExpenses = [...expenses];
    if (prices) {
      newExpenses.push({
        technicianId: techId,
        buyPrice: prices.buyPrice,
        sellPrice: prices.sellPrice
      });
    }

    if (role === 'primary') {
      const updatedTechs = value.map(t => ({
        ...t,
        role: 'secondary'
      }));
      onChange([...updatedTechs, newTech], newExpenses);
    } else {
      onChange([...value, newTech], newExpenses);
    }
  };

  const handleRemoveTechnician = (techId: string) => {
    onChange(
      value.filter(t => t.id !== techId),
      expenses.filter(e => e.technicianId !== techId)
    );
  };

  const handlePriceSubmit = () => {
    if (selectedTechId) {
      addTechnicianToList(selectedTechId, selectedRole, tempPrices);
      setShowPriceModal(false);
      setSelectedTechId(null);
      setTempPrices({ buyPrice: 0, sellPrice: 0 });
    }
  };

  const handleEditPrices = (techId: string) => {
    const tech = value.find(t => t.id === techId);
    if (tech && tech.isSubcontractor) {
      setSelectedTechId(techId);
      setSelectedRole(tech.role);
      setShowPriceModal(true);
      setTempPrices({
        buyPrice: tech.buyPrice || 0,
        sellPrice: tech.sellPrice || 0
      });
    }
  };

  const primaryTech = value.find(t => t.role === 'primary');
  const secondaryTechs = value.filter(t => t.role === 'secondary');
  const availableTechs = technicians.filter(t => !value.some(v => v.id === t.id));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Technicien principal
        </label>
        {primaryTech ? (
          <div className="mt-1 flex items-center justify-between p-2 bg-blue-50 rounded-md">
            <div className="flex-1">
              <span className="text-sm font-medium text-blue-700">{primaryTech.name}</span>
              {primaryTech.isSubcontractor && (
                <div className="text-xs text-blue-600 mt-1">
                  <div>Prix d'achat: {primaryTech.buyPrice}€</div>
                  <div>Prix de vente: {primaryTech.sellPrice}€</div>
                  <button
                    type="button"
                    onClick={() => handleEditPrices(primaryTech.id)}
                    className="mt-1 text-blue-700 hover:text-blue-900 underline"
                  >
                    Modifier les prix
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveTechnician(primaryTech.id)}
              className="text-blue-500 hover:text-blue-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => handleAddTechnician(e.target.value, 'primary')}
            value=""
          >
            <option value="">Sélectionner un technicien principal</option>
            {availableTechs.map(tech => (
              <option key={tech.id} value={tech.id}>
                {tech.name} {tech.role === 'SUBCONTRACTOR' ? '(Sous-traitant)' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Techniciens secondaires
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={(e) => handleAddTechnician(e.target.value, 'secondary')}
          value=""
        >
          <option value="">Ajouter un technicien secondaire</option>
          {availableTechs.map(tech => (
            <option key={tech.id} value={tech.id}>
              {tech.name} {tech.role === 'SUBCONTRACTOR' ? '(Sous-traitant)' : ''}
            </option>
          ))}
        </select>

        {secondaryTechs.length > 0 && (
          <div className="mt-2 space-y-2">
            {secondaryTechs.map(tech => (
              <div key={tech.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div>
                  <span className="text-sm text-gray-700">{tech.name}</span>
                  {tech.isSubcontractor && (
                    <div className="text-xs text-gray-500">
                      <div>Prix d'achat: {tech.buyPrice}€</div>
                      <div>Prix de vente: {tech.sellPrice}€</div>
                      <button
                        type="button"
                        onClick={() => handleEditPrices(tech.id)}
                        className="mt-1 text-blue-600 hover:text-blue-800 underline"
                      >
                        Modifier les prix
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTechnician(tech.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {showPriceModal && selectedTechId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Prix du sous-traitant</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix d'achat (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tempPrices.buyPrice}
                  onChange={(e) => setTempPrices({ ...tempPrices, buyPrice: parseFloat(e.target.value) })}
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
                  value={tempPrices.sellPrice}
                  onChange={(e) => setTempPrices({ ...tempPrices, sellPrice: parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPriceModal(false);
                    setSelectedTechId(null);
                    setTempPrices({ buyPrice: 0, sellPrice: 0 });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handlePriceSubmit}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}