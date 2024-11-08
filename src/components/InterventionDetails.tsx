import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, FileText, Package, User, AlertCircle } from 'lucide-react';
import type { Intervention } from '../hooks/useInterventions';

interface InterventionDetailsProps {
  intervention: Intervention;
  onClose: () => void;
}

export default function InterventionDetails({ intervention, onClose }: InterventionDetailsProps) {
  const isCompleted = intervention.status === 'completed';

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">{intervention.title}</h2>
          <p className="text-gray-500">{intervention.client}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isCompleted ? 'Terminée' : 'En cours'}
        </span>
      </div>

      {/* Informations générales */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Description</h3>
          <p className="mt-1 text-gray-600">{intervention.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Date</h3>
            <p className="mt-1 text-gray-600">
              {format(new Date(intervention.date), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Site</h3>
            <p className="mt-1 text-gray-600">{intervention.siteName}</p>
          </div>
        </div>
      </div>

      {/* Techniciens */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium mb-3">Techniciens</h3>
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

      {/* Détails de clôture si intervention terminée */}
      {isCompleted && intervention.closureData && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium mb-3">Détails d'intervention</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Notes de réalisation</h4>
                <p className="mt-1 text-gray-600">{intervention.closureData.completionNotes}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Heure d'arrivée</h4>
                  <p className="mt-1 text-gray-600">{intervention.closureData.arrivalTime}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Heure de départ</h4>
                  <p className="mt-1 text-gray-600">{intervention.closureData.departureTime}</p>
                </div>
              </div>

              {intervention.closureData.materials?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Matériel utilisé</h4>
                  <div className="mt-2 space-y-2">
                    {intervention.closureData.materials.map((material, index) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded-md">
                        <span className="text-sm">{material.designation}</span>
                        <span className="text-sm text-gray-500">{material.serialNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {intervention.closureData.needsFollowUp && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">Suivi nécessaire</h4>
                  </div>
                  {intervention.closureData.followUpNotes && (
                    <p className="mt-2 text-yellow-700">{intervention.closureData.followUpNotes}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium mb-3">Signature</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Signé par: {intervention.closureData.signatoryName}</p>
              {intervention.closureData.signature && (
                <img 
                  src={intervention.closureData.signature} 
                  alt="Signature" 
                  className="max-w-sm border rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Pièces jointes */}
          {intervention.closureData.attachments?.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium mb-3">Pièces jointes</h3>
              <div className="grid grid-cols-2 gap-4">
                {intervention.closureData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded-md">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}