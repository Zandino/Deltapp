export interface Location {
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export interface SiteContact {
  name: string;
  phone: string;
}

export interface TechnicianAssignment {
  id: string;
  name: string;
  role: 'primary' | 'secondary';
  isSubcontractor: boolean;
  buyPrice?: number;
  sellPrice?: number;
}

export interface Intervention {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'in_progress' | 'completed';
  location: Location;
  clientId: string;
  client: string;
  siteName: string;
  siteContact: SiteContact;
  technicians: TechnicianAssignment[];
  isSubcontracted: boolean;
  invoiceStatus?: 'pending' | 'submitted' | 'paid';
  invoiceNumber?: string;
  projectId?: string;
  serviceId?: string;
  trackingNumbers: string[];
  attachments: string[];
}

export type InterventionInput = Omit<Intervention, 
  'id' | 'status' | 'isSubcontracted' | 'client'
>;