import React, { useEffect, useState } from 'react';
import { getTrackingInfo } from '../lib/tracking';
import { Package, MapPin, Calendar } from 'lucide-react';

interface TrackingDisplayProps {
  trackingNumber: string;
}

export default function TrackingDisplay({ trackingNumber }: TrackingDisplayProps) {
  const [trackingInfo, setTrackingInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const info = await getTrackingInfo(trackingNumber);
        setTrackingInfo(info);
      } catch (err) {
        setError('Erreur lors de la récupération des informations de suivi');
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [trackingNumber]);

  if (loading) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  if (!trackingInfo) {
    return <div className="text-gray-500 py-4">Aucune information disponible</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center space-x-3 mb-4">
        <Package className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">{trackingNumber}</h3>
      </div>

      {trackingInfo.latest_event && (
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium">Dernier statut</p>
              <p className="text-sm text-gray-600">{trackingInfo.latest_event.description}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-gray-600">
                {new Date(trackingInfo.latest_event.time_utc).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}