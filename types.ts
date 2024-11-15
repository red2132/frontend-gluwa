/**
 * balance 타입
 */
export interface balanceProps {
  CTC: number;
  USDC: number;
  USDT: number;
  WCTC: number;
}

/**
 * you pay의 타입(balance 타입의 키로 제한)
 */
export interface PayStoreProps {
  payCurrency: keyof balanceProps;
  setPayCurrency: (newCurrency: keyof balanceProps) => void;
}

/**
 * you pay의 타입(balance 타입 + select token 추가)
 */
export interface ReceiveStoreProps{
  receiveCurrency: keyof balanceProps | "Select token";
  setReceiveCurrency: (newCurrency: keyof balanceProps |"Select token" ) => void;
}