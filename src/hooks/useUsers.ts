import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types/user';

interface UsersState {
  users: User[];
  addUser: (userData: Omit<User, 'id' | 'isActive'>) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  getUser: (email: string, password: string) => User | null;
}

const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@deltapp.fr',
    name: 'Admin Demo',
    role: 'ADMIN',
    company: 'DeltAPP',
    isActive: true,
    password: 'demo123',
    departments: ['14']
  },
  {
    id: '2',
    email: 'dispatcher@deltapp.fr',
    name: 'Dispatcher Demo',
    role: 'DISPATCHER',
    company: 'DeltAPP',
    isActive: true,
    password: 'demo123',
    departments: ['14']
  },
  {
    id: '3',
    email: 'tech@deltapp.fr',
    name: 'Technicien Demo',
    role: 'TECHNICIAN',
    company: 'DeltAPP',
    isActive: true,
    password: 'demo123',
    departments: ['14']
  },
  {
    id: '4',
    email: 'subcontractor@deltapp.fr',
    name: 'Sous-traitant Demo',
    role: 'SUBCONTRACTOR',
    company: 'DeltAPP Partner',
    isActive: true,
    password: 'demo123',
    departments: ['14']
  }
];

export const useUsers = create<UsersState>()(
  persist(
    (set, get) => ({
      users: defaultUsers,
      
      addUser: async (userData) => {
        try {
          // Vérifier si l'utilisateur existe déjà
          const existingUser = get().users.find(u => u.email === userData.email);
          if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
          }

          const newUser: User = {
            ...userData,
            id: crypto.randomUUID(),
            isActive: true,
          };

          set((state) => ({
            users: [...state.users, newUser],
          }));

          return newUser;
        } catch (error) {
          console.error('Error adding user:', error);
          throw error;
        }
      },

      updateUser: async (id, updates) => {
        try {
          // Vérifier si l'email est déjà utilisé par un autre utilisateur
          if (updates.email) {
            const existingUser = get().users.find(
              u => u.email === updates.email && u.id !== id
            );
            if (existingUser) {
              throw new Error('Un utilisateur avec cet email existe déjà');
            }
          }

          set((state) => ({
            users: state.users.map((user) =>
              user.id === id ? { ...user, ...updates } : user
            ),
          }));
        } catch (error) {
          console.error('Error updating user:', error);
          throw error;
        }
      },

      deleteUser: async (id) => {
        try {
          set((state) => ({
            users: state.users.filter((user) => user.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting user:', error);
          throw error;
        }
      },

      toggleUserStatus: async (id) => {
        try {
          set((state) => ({
            users: state.users.map((user) =>
              user.id === id ? { ...user, isActive: !user.isActive } : user
            ),
          }));
        } catch (error) {
          console.error('Error toggling user status:', error);
          throw error;
        }
      },

      getUser: (email, password) => {
        const user = get().users.find(
          u => u.email === email && u.password === password && u.isActive
        );
        return user || null;
      }
    }),
    {
      name: 'users-storage',
      partialize: (state) => ({
        users: state.users
      })
    }
  )
);