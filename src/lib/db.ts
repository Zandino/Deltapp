import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DBState {
  interventions: any[];
  users: any[];
  invoices: any[];
  adminDocuments: any[];
  addIntervention: (intervention: any) => void;
  updateIntervention: (id: string, data: any) => void;
  deleteIntervention: (id: string) => void;
  addUser: (user: any) => void;
  updateUser: (id: string, data: any) => void;
  deleteUser: (id: string) => void;
  addInvoice: (invoice: any) => void;
  updateInvoice: (id: string, data: any) => void;
  deleteInvoice: (id: string) => void;
  addAdminDocument: (document: any) => void;
  updateAdminDocument: (id: string, data: any) => void;
  deleteAdminDocument: (id: string) => void;
}

const useDB = create<DBState>()(
  persist(
    (set) => ({
      interventions: [],
      users: [],
      invoices: [],
      adminDocuments: [],

      addIntervention: (intervention) =>
        set((state) => ({
          interventions: [...state.interventions, { ...intervention, id: crypto.randomUUID() }],
        })),

      updateIntervention: (id, data) =>
        set((state) => ({
          interventions: state.interventions.map((i) =>
            i.id === id ? { ...i, ...data } : i
          ),
        })),

      deleteIntervention: (id) =>
        set((state) => ({
          interventions: state.interventions.filter((i) => i.id !== id),
        })),

      addUser: (user) =>
        set((state) => ({
          users: [...state.users, { ...user, id: crypto.randomUUID() }],
        })),

      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, { ...invoice, id: crypto.randomUUID() }],
        })),

      updateInvoice: (id, data) =>
        set((state) => ({
          invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...data } : i)),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((i) => i.id !== id),
        })),

      addAdminDocument: (document) =>
        set((state) => ({
          adminDocuments: [...state.adminDocuments, { ...document, id: crypto.randomUUID() }],
        })),

      updateAdminDocument: (id, data) =>
        set((state) => ({
          adminDocuments: state.adminDocuments.map((d) =>
            d.id === id ? { ...d, ...data } : d
          ),
        })),

      deleteAdminDocument: (id) =>
        set((state) => ({
          adminDocuments: state.adminDocuments.filter((d) => d.id !== id),
        })),
    }),
    {
      name: 'app-storage',
    }
  )
);

export default useDB;