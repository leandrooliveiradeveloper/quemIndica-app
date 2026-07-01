import { create } from 'zustand';

type UserState = {
  existeUsuario: boolean;
  setExisteUsuario: (value: boolean) => void;
};

export const useUserStore = create<UserState>((set) => ({
  existeUsuario: false,
  setExisteUsuario: (value) => set({ existeUsuario: value }),
}));
