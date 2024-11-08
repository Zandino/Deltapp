import axios from 'axios';

interface TrackingValidationResponse {
  isValid: boolean;
  message?: string;
}

export async function validateTrackingNumber(trackingNumber: string): Promise<TrackingValidationResponse> {
  try {
    // Configuration de l'API 17Track
    const config = {
      headers: {
        '17token': '0DC48F3CDE937D18198B1ED53807769F',
        'Content-Type': 'application/json'
      }
    };

    // Préparer les données pour l'API
    const data = [{
      number: trackingNumber
    }];

    // Appel à l'API 17Track pour valider le numéro
    const response = await axios.post(
      'https://api.17track.net/track/v2.2/register',
      data,
      config
    );

    // Vérifier la réponse
    if (response.data.code === 0 && response.data.data.accepted.length > 0) {
      return {
        isValid: true
      };
    }

    return {
      isValid: false,
      message: 'Numéro de suivi invalide'
    };

  } catch (error) {
    console.error('Erreur lors de la validation:', error);
    return {
      isValid: false,
      message: 'Erreur lors de la validation'
    };
  }
}

export async function getTrackingInfo(trackingNumber: string) {
  try {
    const config = {
      headers: {
        '17token': '0DC48F3CDE937D18198B1ED53807769F',
        'Content-Type': 'application/json'
      }
    };

    const data = [{
      number: trackingNumber
    }];

    const response = await axios.post(
      'https://api.17track.net/track/v2.2/gettrackinfo',
      data,
      config
    );

    if (response.data.code === 0 && response.data.data.accepted.length > 0) {
      return response.data.data.accepted[0];
    }

    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du suivi:', error);
    return null;
  }
}