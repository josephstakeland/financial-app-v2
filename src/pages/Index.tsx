import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { generateId } from "@/lib/utils";
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
  date: string;
}

const Index = () => {
  const { user, isLoading } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleNewTransaction = (transaction: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      { ...transaction, id: generateId() },
      ...prev,
    ]);
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
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
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
        <div className="grid grid-cols-5 gap-4">
          {[
            { icon: Plane, label: "Viajes" },
            { icon: Home, label: "Hogar" },
            { icon: User2, label: "Personal" },
            { icon: Cloud, label: "Servicios" },
            { icon: Plus, label: "Agregar" },
          ].map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col items-center p-4 h-auto gap-2"
              onClick={() => action.label === "Agregar" && document.querySelector<HTMLButtonElement>('[data-new-transaction]')?.click()}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-sm">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <ExpenseChart
            data={getChartData("income")}
            title="Tendencia de Ingresos"
            color="#10B981"
          />
          <ExpenseChart
            data={getChartData("expense")}
            title="Tendencia de Gastos"
            color="#F43F5E"
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
