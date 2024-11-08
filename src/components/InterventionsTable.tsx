import React from 'react';
import { Eye, Edit, UserPlus, Trash2, Copy, CheckCircle, Euro } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Intervention } from '../hooks/useInterventions';

interface InterventionsTableProps {
  interventions: Intervention[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAssignTechnician?: (id: string) => void;
  onClose?: (id: string) => void;
}

export default function InterventionsTable({
  interventions,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onAssignTechnician,
  onClose
}: InterventionsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminée';
      case 'in_progress':
        return 'En cours';
      default:
        return 'En attente';
    }
  };

  const handleClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const getTechniciansDisplay = (technicians: Intervention['technicians']) => {
    if (!technicians || technicians.length === 0) {
      return 'Non assigné';
    }

    const primaryTech = technicians.find(t => t.role === 'primary');
    const secondaryTechs = technicians.filter(t => t.role === 'secondary');

    let display = primaryTech ? `${primaryTech.name} (Principal)` : '';
    if (secondaryTechs.length > 0) {
      if (display) display += ', ';
      display += secondaryTechs.map(t => `${t.name} (Secondaire)`).join(', ');
    }

    return display;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N°
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Titre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix Achat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix Vente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Site
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Techniciens
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {interventions.map((intervention) => (
            <tr 
              key={intervention.id} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onView(intervention.id)}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {intervention.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(`${intervention.date}T${intervention.time}`), 'Pp', { locale: fr })}
              </td>
              <td className="px-6 py-4">{intervention.title}</td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium">{intervention.client}</p>
                  <p className="text-sm text-gray-500">{intervention.phone}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-gray-900">
                  <Euro className="h-4 w-4 mr-1 text-gray-500" />
                  {intervention.buyPrice?.toLocaleString('fr-FR') || '0'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-gray-900">
                  <Euro className="h-4 w-4 mr-1 text-gray-500" />
                  {intervention.sellPrice?.toLocaleString('fr-FR') || '0'}
                </div>
              </td>
              <td className="px-6 py-4">{intervention.siteName}</td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(intervention.status)}`}>
                  {getStatusText(intervention.status)}
                </span>
              </td>
              <td className="px-6 py-4">
                {getTechniciansDisplay(intervention.technicians)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => handleClick(e, () => onEdit(intervention.id))}
                    className="text-yellow-600 hover:text-yellow-900"
                    title="Modifier"
                  >
                    <Edit className="h-5 w-5" />
                  </button>

                  <button
                    onClick={(e) => handleClick(e, () => onDuplicate(intervention.id))}
                    className="text-green-600 hover:text-green-900"
                    title="Dupliquer"
                  >
                    <Copy className="h-5 w-5" />
                  </button>

                  {onAssignTechnician && !intervention.technicians?.length && (
                    <button
                      onClick={(e) => handleClick(e, () => onAssignTechnician(intervention.id))}
                      className="text-blue-600 hover:text-blue-900"
                      title="Assigner un technicien"
                    >
                      <UserPlus className="h-5 w-5" />
                    </button>
                  )}

                  {onClose && intervention.status !== 'completed' && (
                    <button
                      onClick={(e) => handleClick(e, () => onClose(intervention.id))}
                      className="text-green-600 hover:text-green-900"
                      title="Clôturer l'intervention"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}

                  <button
                    onClick={(e) => handleClick(e, () => onDelete(intervention.id))}
                    className="text-red-600 hover:text-red-900"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}