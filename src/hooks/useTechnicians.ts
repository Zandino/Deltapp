import { create } from 'zustand';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface TechniciansStore {
  technicians: Technician[];
  addTechnician: (technician: Technician) => void;
  removeTechnician: (id: string) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
}

export const useTechnicians = create<TechniciansStore>((set) => ({
  technicians: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '0123456789',
      role: 'Technicien',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      role: 'Sous-traitant',
    },
  ],
  addTechnician: (technician) =>
    set((state) => ({
      technicians: [...state.technicians, technician],
    })),
  removeTechnician: (id) =>
    set((state) => ({
      technicians: state.technicians.filter((tech) => tech.id !== id),
    })),
  updateTechnician: (id, updates) =>
    set((state) => ({
      technicians: state.technicians.map((tech) =>
        tech.id === id ? { ...tech, ...updates } : tech
      ),
    })),
}));