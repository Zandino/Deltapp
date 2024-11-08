import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Price {
  id: string;
  clientId: string;
  clientName: string;
  contractId?: string;
  contractName?: string;
  serviceType: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  unit: 'hour' | 'day' | 'unit';
}

interface PricingStore {
  prices: Price[];
  addPrice: (price: Omit<Price, 'id'>) => void;
  updatePrice: (id: string, price: Partial<Price>) => void;
  deletePrice: (id: string) => void;
  importPrices: (data: any[]) => void;
}

export const usePricing = create<PricingStore>()(
  persist(
    (set) => ({
      prices: [],
      
      addPrice: (priceData) => {
        const newPrice = {
          ...priceData,
          id: crypto.randomUUID()
        };

        set((state) => ({
          prices: [...state.prices, newPrice]
        }));
      },

      updatePrice: (id, priceData) => {
        set((state) => ({
          prices: state.prices.map((price) =>
            price.id === id ? { ...price, ...priceData } : price
          )
        }));
      },

      deletePrice: (id) => {
        set((state) => ({
          prices: state.prices.filter((price) => price.id !== id)
        }));
      },

      importPrices: (data) => {
        const newPrices = data.map(item => ({
          ...item,
          id: crypto.randomUUID(),
          buyPrice: Number(item.buyPrice),
          sellPrice: Number(item.sellPrice)
        }));

        set((state) => ({
          prices: [...state.prices, ...newPrices]
        }));
      }
    }),
    {
      name: 'pricing-storage'
    }
  )
);