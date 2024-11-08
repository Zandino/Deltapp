import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface ClientsState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (id: string, client: Omit<Client, 'id'>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  importClients: (data: any[]) => void;
}

export const useClients = create<ClientsState>()(
  persist(
    (set, get) => ({
      clients: [],
      isLoading: false,
      error: null,

      fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
          // Dans un environnement de production, vous feriez un appel API ici
          // Pour l'instant, on utilise juste les données persistées
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch clients',
            isLoading: false 
          });
        }
      },

      addClient: async (clientData) => {
        const newClient = {
          ...clientData,
          id: crypto.randomUUID(),
        };

        set((state) => ({
          clients: [...state.clients, newClient],
        }));
      },

      updateClient: async (id, clientData) => {
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === id ? { ...client, ...clientData } : client
          ),
        }));
      },

      deleteClient: async (id) => {
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== id),
        }));
      },

      importClients: (data) => {
        const newClients = data.map(item => ({
          ...item,
          id: crypto.randomUUID()
        }));

        set((state) => ({
          clients: [...state.clients, ...newClients]
        }));
      }
    }),
    {
      name: 'clients-storage',
    }
  )
);