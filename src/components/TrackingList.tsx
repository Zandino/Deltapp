import React from 'react';
import { Package, Trash2 } from 'lucide-react';
import { TrackingStatus, StatusColors } from '../lib/tracking';

interface TrackingListProps {
  trackingNumbers: Array<{
    number: string;
    status?: string;
    lastUpdate?: string;
  }>;
  onRemove: (number: string) => void;
}

export default function TrackingList({ trackingNumbers, onRemove }: TrackingListProps) {
  if (trackingNumbers.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {trackingNumbers.map((tracking) => (
        <div
          key={tracking.number}
          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">{tracking.number}</p>
              {tracking.status && (
                <p className={`text-sm text-${StatusColors[tracking.status as keyof typeof StatusColors]}-600`}>
                  {TrackingStatus[tracking.status as keyof typeof TrackingStatus]}
                </p>
              )}
              {tracking.lastUpdate && (
                <p className="text-sm text-gray-500">
                  Dernière mise à jour: {tracking.lastUpdate}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemove(tracking.number)}
            className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}