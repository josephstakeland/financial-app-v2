import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { IncomeExpenseChart } from "@/components/dashboard/IncomeExpenseChart";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { generateId } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { 
  Plane, 
  Home, 
  User2, 
  Cloud, 
  Plus,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  label: "viajes" | "transporte" | "hogar" | "personal" | "servicios";
  date: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Load transactions only once when component mounts or user changes
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        if (!user?.id) return;

        setLoadingTransactions(true);
        
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10);  // Get only last 10 transactions

        if (error) throw error;

        if (data) {
          const formattedTransactions = data.map(t => ({
            ...t,
            date: new Date(t.date).toISOString()
          }));
          setTransactions(formattedTransactions);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    loadTransactions();
  }, [user?.id]);

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleNewTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description,
          label: transaction.label,
          date: transaction.date,
          user_id: user.id
        }])
        .select();
      
      if (error) throw error;

      if (data) {
        const newTransaction = { 
          ...transaction, 
          id: data[0].id,
          date: new Date(transaction.date).toISOString()
        };
        setTransactions((prev) => [newTransaction, ...prev]);
        return true;
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert(`Error al guardar la transacción: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      return false;
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpenses;

  const getChartData = (type: "income" | "expense") => {
    return transactions
      .filter((t) => t.type === type)
      .map((t) => ({
        date: new Date(t.date).toLocaleDateString(),
        amount: t.amount,
      }));
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User2 className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Rest of the dashboard */}
        <div className="bg-blue-500 text-white p-6 rounded-xl">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">Cargando...</h2>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">¡Hola, {user.name}!</h2>
              <span className="text-2xl">👋</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">¡Bienvenido!</h2>
              <span className="text-2xl">👋</span>
            </div>
          )}
        </div>

        {/* Balance Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <BalanceCard
            balance={totalIncome}
            title="Total Ingresos"
            type="income"
          />
          <BalanceCard
            balance={totalExpenses}
            title="Total Gastos"
            type="expense"
          />
          <BalanceCard
            balance={balance}
            title="Balance Total"
            type="total"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Plane, label: "Viajes" },
            { icon: Home, label: "Hogar" },
            { icon: Cloud, label: "Servicios" },
          ].map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col items-center p-4 h-auto gap-2"
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4">
          <IncomeExpenseChart 
            data={transactions.map(t => ({
              date: new Date(t.date).toLocaleDateString(),
              income: t.type === 'income' ? t.amount : 0,
              expenses: t.type === 'expense' ? t.amount : 0
            }))}
          />
        </div>

        {/* Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Transacciones Recientes</h2>
            <TransactionForm onSubmit={handleNewTransaction} />
          </div>
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default Index;
