import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface TrackingWidgetProps {
  trackingNumber: string;
  carrier?: string;
  className?: string;
}

declare global {
  interface Window {
    YQV5: {
      trackSingle: (options: {
        YQ_ContainerId: string;
        YQ_Height: number;
        YQ_Fc: string;
        YQ_Lang: string;
        YQ_Num: string;
      }) => void;
    };
  }
}

const TrackingWidget: React.FC<TrackingWidgetProps> = ({ 
  trackingNumber, 
  carrier,
  className = ''
}) => {
  const containerId = useRef(`tracking-container-${Math.random().toString(36).substr(2, 9)}`);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    // Load 17Track script
    const script = document.createElement('script');
    script.src = 'https://t.17track.net/track-js-sdk-v5';
    script.async = true;

    script.onload = () => {
      try {
        if (window.YQV5) {
          window.YQV5.trackSingle({
            YQ_ContainerId: containerId.current,
            YQ_Height: 600,
            YQ_Fc: '0DC48F3CDE937D18198B1ED53807769F', // Your API key
            YQ_Lang: 'fr',
            YQ_Num: trackingNumber
          });
          setIsLoading(false);
        } else {
          setError('Le widget de suivi n\'a pas pu être chargé');
        }
      } catch (err) {
        console.error('Error initializing tracking widget:', err);
        setError('Une erreur est survenue lors de l\'initialisation du widget');
      }
    };

    script.onerror = () => {
      setError('Impossible de charger le widget de suivi');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [trackingNumber]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
      <div 
        id={containerId.current}
        className={`w-full min-h-[600px] bg-white rounded-lg shadow-sm ${
          isLoading ? 'hidden' : ''
        }`}
      />
    </div>
  );
};

export default TrackingWidget;