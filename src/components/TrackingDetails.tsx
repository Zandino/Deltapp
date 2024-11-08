import React, { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { getTrackingStatus } from '../lib/tracking';
import TrackingWidget from './TrackingWidget';

interface TrackingDetailsProps {
  trackingNumber: string;
  carrier?: string;
  onClose?: () => void;
}

const TrackingDetails: React.FC<TrackingDetailsProps> = ({
  trackingNumber,
  carrier,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getTrackingStatus(trackingNumber, carrier);
        setStatus(result);
      } catch (err) {
        setError('Impossible de récupérer le statut du colis');
        console.error('Error fetching tracking status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [trackingNumber, carrier]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Suivi du colis</h3>
              <p className="text-sm text-gray-500">{trackingNumber}</p>
            </div>
          </div>
          {status?.lastEvent && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.status === 'Delivered' 
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {status.status}
            </span>
          )}
        </div>

        {error ? (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : status?.lastEvent ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Localisation</p>
                <p className="text-sm text-gray-500">{status.lastEvent.location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Dernière mise à jour</p>
                <p className="text-sm text-gray-500">
                  {new Date(status.lastEvent.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Statut</p>
                <p className="text-sm text-gray-500">{status.lastEvent.description}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <TrackingWidget 
        trackingNumber={trackingNumber}
        carrier={carrier}
        className="bg-white p-6 rounded-lg shadow-sm"
      />
    </div>
  );
};

export default TrackingDetails;