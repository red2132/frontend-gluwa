import { PayStoreProps, ReceiveStoreProps } from './../../types';
import { create } from "zustand";

/**
 * you pay의 currency
 */
export const usePayStore = create<PayStoreProps>((set) => ({
  payCurrency: "CTC",
  setPayCurrency: (newCurrency) => set({ payCurrency: newCurrency }),
}));

/**
 * you receive의 currency
 */
export const useReceiveStore = create<ReceiveStoreProps>((set) => ({ 
  receiveCurrency: "Select token",
  setReceiveCurrency: (newCurrency) => set({ receiveCurrency: newCurrency }),
}));
