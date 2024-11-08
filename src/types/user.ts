export type UserRole = 'ADMIN' | 'DISPATCHER' | 'TECHNICIAN' | 'SUBCONTRACTOR';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  company?: string;
  isActive: boolean;
  password?: string;
  departments?: string[];
  address?: string;
  city?: string;
  postalCode?: string;
}