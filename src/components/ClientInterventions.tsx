import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useInterventions } from '../hooks/useInterventions';
import { useClients } from '../hooks/useClients';
import { Calendar, Euro, FileText, X, ChevronDown } from 'lucide-react';

interface ClientInterventionsProps {
  clientId: string;
  onClose: () => void;
}

export default function ClientInterventions({ clientId, onClose }: ClientInterventionsProps) {
  const { interventions } = useInterventions();
  const { clients } = useClients();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [expandedMonths, setExpandedMonths] = useState<Date[]>([new Date()]);
  
  const client = clients.find(c => c.id === clientId);
  
  // Générer les 3 derniers mois
  const lastThreeMonths = [
    selectedMonth,
    subMonths(selectedMonth, 1),
    subMonths(selectedMonth, 2)
  ];

  // Calculer les totaux pour un mois donné
  const calculateMonthTotals = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthInterventions = interventions.filter(intervention => 
      intervention.clientId === clientId &&
      new Date(intervention.date) >= monthStart &&
      new Date(intervention.date) <= monthEnd
    );

    return monthInterventions.reduce((acc, intervention) => ({
      totalBuy: acc.totalBuy + (intervention.buyPrice || 0),
      totalSell: acc.totalSell + (intervention.sellPrice || 0),
      interventions: [...acc.interventions, intervention]
    }), { totalBuy: 0, totalSell: 0, interventions: [] as typeof interventions });
  };

  const toggleMonth = (month: Date) => {
    setExpandedMonths(prev => {
      const isExpanded = prev.some(m => isSameMonth(m, month));
      if (isExpanded) {
        return prev.filter(m => !isSameMonth(m, month));
      }
      return [...prev, month];
    });
  };

  return (
    <div className="max-w-4xl w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold">{client?.company}</h2>
          <p className="text-gray-500">Interventions et facturation</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-6">
        {lastThreeMonths.map(month => {
          const { totalBuy, totalSell, interventions: monthInterventions } = calculateMonthTotals(month);
          const isExpanded = expandedMonths.some(m => isSameMonth(m, month));

          return (
            <div key={month.toISOString()} className="bg-white rounded-lg shadow">
              <div 
                className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
                onClick={() => toggleMonth(month)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {format(month, 'MMMM yyyy', { locale: fr })}
                  </h3>
                  <ChevronDown 
                    className={`h-5 w-5 transform transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-700">Total Achats</span>
                      <Euro className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-xl font-bold text-blue-700">
                      {totalBuy.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-700">Total Ventes</span>
                      <Euro className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-xl font-bold text-green-700">
                      {totalSell.toLocaleString('fr-FR')} €
                    </p>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="divide-y divide-gray-200">
                  {monthInterventions.length > 0 ? (
                    monthInterventions.map((intervention) => (
                      <div key={intervention.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{intervention.title}</h4>
                            <p className="text-sm text-gray-500">{intervention.description}</p>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(intervention.date), 'dd MMMM yyyy', { locale: fr })}
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center justify-end text-sm text-gray-500">
                              <span className="mr-2">Prix d'achat:</span>
                              <Euro className="h-4 w-4 mr-1" />
                              <span>{intervention.buyPrice?.toLocaleString('fr-FR') || '0'} €</span>
                            </div>
                            <div className="flex items-center justify-end text-sm font-medium text-gray-900">
                              <span className="mr-2">Prix de vente:</span>
                              <Euro className="h-4 w-4 mr-1" />
                              <span>{intervention.sellPrice?.toLocaleString('fr-FR') || '0'} €</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      Aucune intervention pour ce mois
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          onClick={() => {/* Logique pour générer la préfacture */}}
        >
          <FileText className="h-5 w-5 mr-2" />
          Générer la préfacture
        </button>
      </div>
    </div>
  );
}