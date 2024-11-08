import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Technician {
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
  status: 'pending' | 'in_progress' | 'completed';
  location: {
    address: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  clientId: string;
  client: string;
  siteName: string;
  phone: string;
  technicians: Technician[];
  expenses: {
    type: string;
    amount: number;
    description?: string;
  }[];
  buyPrice: number;
  sellPrice: number;
  totalExpenses: number;
  totalAmount: number;
  closureData?: any;
  trackingNumbers: string[];
  attachments: string[];
}

interface InterventionsStore {
  interventions: Intervention[];
  counter: number;
  isLoading: boolean;
  error: string | null;
  addIntervention: (intervention: Omit<Intervention, 'id' | 'status' | 'totalExpenses' | 'totalAmount'>) => Promise<void>;
  updateIntervention: (id: string, updates: Partial<Intervention>) => Promise<void>;
  deleteIntervention: (id: string) => Promise<void>;
  duplicateIntervention: (id: string) => Promise<void>;
  fetchInterventions: () => Promise<void>;
  resetIds: () => void;
}

const calculateTotalPrices = (technicians: Technician[] = [], expenses: { amount: number }[] = []): { 
  buyPrice: number; 
  sellPrice: number;
  totalExpenses: number;
  totalAmount: number;
} => {
  const technicianTotals = technicians.reduce((total, tech) => ({
    buyPrice: total.buyPrice + (tech.buyPrice || 0),
    sellPrice: total.sellPrice + (tech.sellPrice || 0)
  }), { buyPrice: 0, sellPrice: 0 });

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return {
    buyPrice: technicianTotals.buyPrice,
    sellPrice: technicianTotals.sellPrice,
    totalExpenses,
    totalAmount: technicianTotals.sellPrice + totalExpenses
  };
};

export const useInterventions = create<InterventionsStore>()(
  persist(
    (set, get) => ({
      interventions: [],
      counter: 1,
      isLoading: false,
      error: null,

      resetIds: () => {
        const { interventions } = get();
        const newInterventions = interventions.map((intervention, index) => ({
          ...intervention,
          id: `T${(index + 1).toString().padStart(5, '0')}`
        }));
        set({
          interventions: newInterventions,
          counter: newInterventions.length + 1
        });
      },

      addIntervention: async (interventionData) => {
        set({ isLoading: true, error: null });
        try {
          const { counter } = get();
          const newId = `T${counter.toString().padStart(5, '0')}`;

          // Ensure buyPrice and sellPrice are numbers
          const buyPrice = parseFloat(interventionData.buyPrice?.toString() || '0');
          const sellPrice = parseFloat(interventionData.sellPrice?.toString() || '0');

          const newIntervention: Intervention = {
            ...interventionData,
            id: newId,
            status: 'pending',
            technicians: interventionData.technicians || [],
            expenses: interventionData.expenses || [],
            trackingNumbers: interventionData.trackingNumbers || [],
            attachments: interventionData.attachments || [],
            buyPrice,
            sellPrice,
            totalExpenses: 0,
            totalAmount: sellPrice
          };

          set(state => ({
            interventions: [...state.interventions, newIntervention],
            counter: state.counter + 1,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error adding intervention:', error);
          set({ error: 'Failed to add intervention', isLoading: false });
          throw error;
        }
      },

      updateIntervention: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const intervention = get().interventions.find(i => i.id === id);
          if (!intervention) {
            throw new Error('Intervention not found');
          }

          // Ensure buyPrice and sellPrice are numbers when updating
          const updatedIntervention = {
            ...intervention,
            ...updates,
            buyPrice: updates.buyPrice !== undefined ? parseFloat(updates.buyPrice.toString()) : intervention.buyPrice,
            sellPrice: updates.sellPrice !== undefined ? parseFloat(updates.sellPrice.toString()) : intervention.sellPrice
          };

          set(state => ({
            interventions: state.interventions.map(i => 
              i.id === id ? updatedIntervention : i
            ),
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error updating intervention:', error);
          set({ error: 'Failed to update intervention', isLoading: false });
          throw error;
        }
      },

      deleteIntervention: async (id) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            interventions: state.interventions.filter(i => i.id !== id),
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error deleting intervention:', error);
          set({ error: 'Failed to delete intervention', isLoading: false });
          throw error;
        }
      },

      duplicateIntervention: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const { counter } = get();
          const intervention = get().interventions.find(i => i.id === id);
          if (!intervention) {
            throw new Error('Intervention not found');
          }

          const { id: oldId, ...interventionData } = intervention;
          const newId = `T${counter.toString().padStart(5, '0')}`;
          const newIntervention: Intervention = {
            ...interventionData,
            id: newId,
            status: 'pending',
            technicians: [],
            buyPrice: intervention.buyPrice,
            sellPrice: intervention.sellPrice,
            totalExpenses: 0,
            totalAmount: intervention.sellPrice
          };

          set(state => ({
            interventions: [...state.interventions, newIntervention],
            counter: state.counter + 1,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error duplicating intervention:', error);
          set({ error: 'Failed to duplicate intervention', isLoading: false });
          throw error;
        }
      },

      fetchInterventions: async () => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            ...state,
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error fetching interventions:', error);
          set({ error: 'Failed to fetch interventions', isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'interventions-storage',
      partialize: (state) => ({
        interventions: state.interventions,
        counter: state.counter
      })
    }
  )
);