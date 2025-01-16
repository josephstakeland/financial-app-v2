import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { supabase } from "../lib/supabase"
import { useUser } from "./UserContext"
import { useToast } from "../hooks/use-toast"

type CurrencyContextType = {
  currency: string
  setCurrency: (currency: string) => Promise<void>
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: async () => {},
  isLoading: true
})

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: userLoading } = useUser()
  const { toast } = useToast()
  const [currency, setCurrencyState] = useState("USD")
  const [isLoading, setIsLoading] = useState(true)

  // Cargar moneda al iniciar
  useEffect(() => {
    const loadCurrency = async () => {
      setIsLoading(true)
      try {
        // Primero intentar obtener de localStorage
        const storedCurrency = localStorage.getItem("currency")
        if (storedCurrency) {
          setCurrencyState(storedCurrency)
        }

        // Si hay usuario autenticado, obtener de Supabase
        if (user && !userLoading) {
          const { data, error } = await supabase
            .from('profiles')
            .select('currency')
            .eq('id', user.id)
            .single()

          if (!error && data?.currency) {
            setCurrencyState(data.currency)
            localStorage.setItem("currency", data.currency)
          }
        }
      } catch (error) {
        console.error('Error loading currency:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCurrency()
  }, [user, userLoading])

  const setCurrency = useCallback(async (newCurrency: string) => {
    try {
      // Actualizar estado local
      setCurrencyState(newCurrency)
      localStorage.setItem("currency", newCurrency)

      // Actualizar en Supabase si el usuario está autenticado
      if (user && !userLoading) {
        const { error } = await supabase
          .from('profiles')
          .update({ currency: newCurrency })
          .eq('id', user.id)

        if (error) throw error
      }

      toast({
        title: "Moneda actualizada",
        description: `La moneda se ha cambiado a ${newCurrency}`,
        variant: "default"
      })
    } catch (error) {
      console.error('Error updating currency:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la moneda",
        variant: "destructive"
      })
    }
  }, [user, userLoading, toast])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
