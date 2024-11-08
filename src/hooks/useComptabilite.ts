import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, parseISO } from 'date-fns';
import { useInterventions } from './useInterventions';

interface Invoice {
  id: string;
  period: string;
  amount: number;
  status: 'En attente' | 'Envoyé' | 'Payé';
  uploadDate?: string;
  attachment?: string;
  interventionsCount: number;
}

interface Stats {
  monthlyRevenue: number;
  monthlyGrowth: number;
  paidInterventions: number;
  pendingInvoices: number;
  recoveryRate: number;
}

interface ComptabiliteStore {
  stats: Stats;
  monthlyInvoices: Invoice[];
  adminDocuments: any[];
  isLoading: boolean;
  error: string | null;
  fetchMonthlyInvoices: () => Promise<void>;
  updateInvoiceStatus: (id: string, status: 'En attente' | 'Envoyé' | 'Payé', attachment?: string) => Promise<void>;
}

function calculateRecoveryRate(invoices: Invoice[]): number {
  const total = invoices.length;
  if (total === 0) return 0;
  const paid = invoices.filter(i => i.status === 'Payé').length;
  return Number(((paid / total) * 100).toFixed(2));
}

export const useComptabilite = create<ComptabiliteStore>()(
  persist(
    (set, get) => ({
      stats: {
        monthlyRevenue: 0,
        monthlyGrowth: 0,
        paidInterventions: 0,
        pendingInvoices: 0,
        recoveryRate: 0
      },
      monthlyInvoices: [],
      adminDocuments: [],
      isLoading: false,
      error: null,

      fetchMonthlyInvoices: async () => {
        set({ isLoading: true, error: null });
        try {
          const { interventions } = useInterventions.getState();
          const currentInvoices = get().monthlyInvoices;

          // Mettre à jour les statistiques
          const currentMonth = currentInvoices[0]?.amount || 0;
          const lastMonth = currentInvoices[1]?.amount || 0;
          const monthlyGrowth = lastMonth ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;

          set({ 
            stats: {
              monthlyRevenue: currentMonth,
              monthlyGrowth: Number(monthlyGrowth.toFixed(2)),
              paidInterventions: interventions.filter(i => i.status === 'completed').length,
              pendingInvoices: currentInvoices.filter(i => i.status === 'En attente').length,
              recoveryRate: calculateRecoveryRate(currentInvoices)
            },
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to fetch invoices', isLoading: false });
        }
      },

      updateInvoiceStatus: async (id: string, status: 'En attente' | 'Envoyé' | 'Payé', attachment?: string) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            monthlyInvoices: state.monthlyInvoices.map(invoice => 
              invoice.id === id 
                ? {
                    ...invoice,
                    status,
                    ...(attachment ? {
                      uploadDate: new Date().toISOString(),
                      attachment
                    } : {})
                  }
                : invoice
            ),
            isLoading: false
          }));

          // Mettre à jour les statistiques après la modification
          await get().fetchMonthlyInvoices();
        } catch (error) {
          set({ error: 'Failed to update invoice status', isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'comptabilite-storage'
    }
  )
);