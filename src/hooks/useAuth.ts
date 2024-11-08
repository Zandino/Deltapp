import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';
import { useUsers } from './useUsers';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string, currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          if (!email || !password) {
            throw new Error('Email et mot de passe requis');
          }

          const user = useUsers.getState().getUser(email, password);
          
          if (!user) {
            throw new Error('Email ou mot de passe incorrect');
          }

          if (!user.isActive) {
            throw new Error('Ce compte est désactivé');
          }

          set({
            token: btoa(`${email}:${password}`),
            user,
            isAuthenticated: true
          });
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Erreur de connexion');
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false
        });
      },

      resetPassword: async (email: string, currentPassword: string, newPassword: string) => {
        const user = useUsers.getState().getUser(email, currentPassword);
        if (!user) {
          throw new Error('Mot de passe actuel incorrect');
        }

        await useUsers.getState().updateUser(user.id, { password: newPassword });
        set({ token: btoa(`${email}:${newPassword}`) });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);