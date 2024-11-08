import { useState } from 'react';

interface GeocodeResult {
  address: string;
  city: string;
  postalCode: string;
  coordinates: [number, number];
}

export function useGeocoding() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const geocoder = new google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK' && results) {
            resolve(results);
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });

      if (result[0]) {
        const { lat, lng } = result[0].geometry.location;
        
        // Extraire les composants de l'adresse
        let streetNumber = '';
        let route = '';
        let city = '';
        let postalCode = '';

        result[0].address_components.forEach(component => {
          if (component.types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (component.types.includes('route')) {
            route = component.long_name;
          }
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        return {
          address: `${streetNumber} ${route}`.trim(),
          city,
          postalCode,
          coordinates: [lat(), lng()]
        };
      }

      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { geocodeAddress, isLoading, error };
}