import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin } from 'lucide-react';

export default function InterventionList({ interventions }) {
  return (
    <div className="space-y-4">
      {interventions.map((intervention) => (
        <div key={intervention.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {intervention.type}
            </p>
            <p className="text-sm text-gray-500">
              {intervention.location.address}, {intervention.location.city}
            </p>
            <p className="text-sm text-gray-500">
              {format(new Date(intervention.date), 'Pp', { locale: fr })}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${intervention.status === 'Terminé' ? 'bg-green-100 text-green-800' : 
                intervention.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'}`}>
              {intervention.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}