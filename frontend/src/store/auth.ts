import { create } from "zustand";
import { User } from "../types/auth";
import api from "../lib/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/user/signin", { email, password });

      localStorage.setItem("token", response.data.jwt);
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  signUp: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post("/user/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.jwt);
      set({ user: response.data.user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  signOut: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));
