import type { Intervention, InterventionInput } from '../types/intervention';

export const serializeIntervention = (data: Partial<InterventionInput>) => {
  const { attachments, ...rest } = data;
  return {
    ...rest,
    trackingNumbers: data.trackingNumbers || [],
    siteContact: {
      name: data.siteContact?.name || '',
      phone: data.siteContact?.phone || ''
    }
  };
};

export const deserializeIntervention = (data: Intervention): Intervention => {
  return {
    ...data,
    trackingNumbers: Array.isArray(data.trackingNumbers) ? data.trackingNumbers : [],
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    siteContact: {
      name: data.siteContact?.name || '',
      phone: data.siteContact?.phone || ''
    }
  };
};

export const validateIntervention = (data: InterventionInput): boolean => {
  const requiredFields = [
    'title',
    'description',
    'date',
    'time',
    'duration',
    'clientId',
    'siteName',
    'location',
    'siteContact'
  ];

  return requiredFields.every(field => {
    const value = data[field as keyof InterventionInput];
    return value !== undefined && value !== null && value !== '';
  });
};