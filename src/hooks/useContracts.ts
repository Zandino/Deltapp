import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Service {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: 'hour' | 'day' | 'unit';
  priceId?: string;
}

interface Contract {
  id: string;
  name: string;
  type: 'MAINTENANCE' | 'SUPPORT' | 'PROJECT' | 'INTERVENTION';
  clientId: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  services: Service[];
}

interface ContractsStore {
  contracts: Contract[];
  addContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  addService: (contractId: string, service: Omit<Service, 'id'>) => void;
  updateService: (contractId: string, serviceId: string, service: Partial<Service>) => void;
  deleteService: (contractId: string, serviceId: string) => void;
  importContracts: (data: any[]) => void;
}

export const useContracts = create<ContractsStore>()(
  persist(
    (set, get) => ({
      contracts: [],
      
      addContract: (contractData) => {
        const newContract = {
          ...contractData,
          id: crypto.randomUUID(),
          services: []
        };

        set((state) => ({
          contracts: [...state.contracts, newContract]
        }));
      },

      updateContract: (id, contractData) => {
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === id ? { ...contract, ...contractData } : contract
          )
        }));
      },

      deleteContract: (id) => {
        set((state) => ({
          contracts: state.contracts.filter((contract) => contract.id !== id)
        }));
      },

      addService: (contractId, serviceData) => {
        const newService = {
          ...serviceData,
          id: crypto.randomUUID()
        };

        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === contractId
              ? { ...contract, services: [...contract.services, newService] }
              : contract
          )
        }));
      },

      updateService: (contractId, serviceId, serviceData) => {
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === contractId
              ? {
                  ...contract,
                  services: contract.services.map((service) =>
                    service.id === serviceId
                      ? { ...service, ...serviceData }
                      : service
                  )
                }
              : contract
          )
        }));
      },

      deleteService: (contractId, serviceId) => {
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === contractId
              ? {
                  ...contract,
                  services: contract.services.filter(
                    (service) => service.id !== serviceId
                  )
                }
              : contract
          )
        }));
      },

      importContracts: (data) => {
        const newContracts = data.map(item => ({
          ...item,
          id: crypto.randomUUID(),
          services: [],
          startDate: new Date(item.startDate).toISOString(),
          endDate: item.endDate ? new Date(item.endDate).toISOString() : undefined
        }));

        set((state) => ({
          contracts: [...state.contracts, ...newContracts]
        }));
      }
    }),
    {
      name: 'contracts-storage'
    }
  )
);