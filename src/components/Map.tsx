import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Location {
  address: string;
  city: string;
  postalCode: string;
  coordinates: [number, number];
}

interface Intervention {
  id: string;
  title: string;
  location: Location;
}

interface MapProps {
  interventions: Intervention[];
}

const DEFAULT_CENTER = { lat: 49.1829, lng: -0.3707 }; // Caen, France
const DEFAULT_ZOOM = 12;

const Map: React.FC<MapProps> = ({ interventions }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: 'AIzaSyCwuBL4RWpZuGQ2twJuavcx51S7Q7Xk7ow',
          version: 'weekly',
        });

        await loader.load();

        if (mapRef.current) {
          const mapOptions: google.maps.MapOptions = {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          };

          googleMapRef.current = new google.maps.Map(mapRef.current, mapOptions);

          // Clear existing markers
          markersRef.current.forEach(marker => marker.setMap(null));
          markersRef.current = [];

          if (interventions?.length > 0) {
            const bounds = new google.maps.LatLngBounds();

            interventions.forEach(intervention => {
              const { coordinates } = intervention.location;
              
              if (coordinates && coordinates.length === 2 && 
                  !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
                const position = { 
                  lat: coordinates[0], 
                  lng: coordinates[1] 
                };

                const marker = new google.maps.Marker({
                  position,
                  map: googleMapRef.current,
                  title: intervention.title,
                });

                const infoWindow = new google.maps.InfoWindow({
                  content: `
                    <div class="p-2">
                      <h3 class="font-semibold">${intervention.title}</h3>
                      <p>${intervention.location.address}</p>
                      <p>${intervention.location.city}, ${intervention.location.postalCode}</p>
                    </div>
                  `,
                });

                marker.addListener('click', () => {
                  infoWindow.open(googleMapRef.current, marker);
                });

                markersRef.current.push(marker);
                bounds.extend(position);
              }
            });

            // Only adjust bounds if we have valid markers
            if (markersRef.current.length > 0) {
              googleMapRef.current.fitBounds(bounds);
              
              // If we only have one marker, zoom out a bit
              if (markersRef.current.length === 1) {
                googleMapRef.current.setZoom(DEFAULT_ZOOM);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [interventions]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg shadow-md"
      style={{ minHeight: '400px' }}
    />
  );
};

export default Map;