import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useCurrency } from "@/context/CurrencyContext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function useFormatCurrency() {
  const { currency } = useCurrency();
  
  return (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };
}
