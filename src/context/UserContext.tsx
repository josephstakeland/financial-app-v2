import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session, WeakPassword, AuthError } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  label: string;
  date: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  transactions: Transaction[];
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  transactions: Transaction[];
  loadTransactions: () => Promise<Transaction[] | null>;
  updateUser: (newUser: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{
    data: {
      user: User | null;
      session: Session | null;
      weakPassword: WeakPassword | null;
    };
    error: AuthError | null;
  }>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  transactions: [],
      loadTransactions: async () => null,
  updateUser: async () => {},
  signIn: async () => ({ 
    data: { user: null, session: null, weakPassword: null }, 
    error: null 
  }),
  signUp: async () => {},
  signOut: async () => {}
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(true);
  const { toast } = useToast();

  const loadTransactions = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data) {
        const formattedTransactions = data.map(t => ({
          ...t,
          date: new Date(t.date).toISOString()
        }));
        setTransactions(formattedTransactions);
        return formattedTransactions;
      }
      return null;
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error || !profile) {
            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
                email: session.user.email || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
          }

          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || '',
            email: session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            transactions: []
          });

          // Cargar transacciones iniciales
          await loadTransactions();
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadTransactions();
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || '',
            email: session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            transactions: transactions
          });
        } else {
          setUser(null);
          setTransactions([]);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const updateUser = async (newUser: Partial<User>) => {
    if (!user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session found');

      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: newUser.name }
      });

      if (metadataError) throw metadataError;

      const { data, error: profileError } = await supabase
        .from('profiles')
        .update({
          name: newUser.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      setUser(prev => ({
        ...prev!,
        name: newUser.name || prev?.name || ''
      }));

      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han actualizado correctamente",
        variant: "default"
      });

    } catch (error) {
      console.error('Error updating user:', error);
      if (!(error instanceof Error && error.message?.includes('validation'))) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el perfil",
          variant: "destructive"
        });
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) return { data: { user: null, session: null, weakPassword: null }, error };

      if (data?.user) {
        const userData = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || '',
          email: data.user.email || '',
          avatar_url: data.user.user_metadata?.avatar_url,
          transactions: []
        };
        setUser(userData);
        await loadTransactions();
        return { 
          data: { 
            user: userData,
            session: data.session,
            weakPassword: data.weakPassword
          },
          error: null
        };
      }
      
      return { data: { user: null, session: null, weakPassword: null }, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        data: { user: null, session: null, weakPassword: null },
        error: error as AuthError
      };
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0]
        }
      }
    });
    
    if (error) throw error;
    
    if (data?.user) {
      await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: email.split('@')[0],
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      setUser({
        id: data.user.id,
        name: data.user.user_metadata?.full_name || '',
        email: data.user.email || '',
        avatar_url: data.user.user_metadata?.avatar_url,
        transactions: []
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTransactions([]);
  };

  return (
    <UserContext.Provider 
      value={{ 
        user: isReady ? user : null, 
        isLoading: !isReady || isLoading,
        transactions,
        loadTransactions,
        updateUser, 
        signIn, 
        signUp, 
        signOut 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  if (context.isLoading) {
    return {
      user: null,
      isLoading: true,
      transactions: [],
      loadTransactions: async () => null,
      updateUser: async () => {},
      signIn: async () => ({ 
        data: { user: null, session: null, weakPassword: null }, 
        error: null 
      }),
      signUp: async () => {},
      signOut: async () => {}
    };
  }

  return context;
}
