import { TransactionList } from "@/components/dashboard/TransactionList";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";

const History = () => {
  // Ejemplo de datos para los gráficos
  const incomeData = [
    { date: "2024-01", amount: 3000 },
    { date: "2024-02", amount: 3500 },
    { date: "2024-03", amount: 4000 },
  ];

  const expenseData = [
    { date: "2024-01", amount: 2000 },
    { date: "2024-02", amount: 2200 },
    { date: "2024-03", amount: 1800 },
  ];

  // Ejemplo de transacciones
  const transactions = [
    {
      id: "1",
      type: "income" as const,
      amount: 3000,
      description: "Salario",
      date: "2024-03-01",
    },
    {
      id: "2",
      type: "expense" as const,
      amount: 800,
      description: "Alquiler",
      date: "2024-03-02",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Historial y Tendencias</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <ExpenseChart
          data={incomeData}
          title="Tendencia de Ingresos"
          color="#10B981"
        />
        <ExpenseChart
          data={expenseData}
          title="Tendencia de Gastos"
          color="#F43F5E"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transacciones</h2>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default History;