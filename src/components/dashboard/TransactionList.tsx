import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatCurrency } from "@/lib/utils";
import { Plane, Briefcase } from "lucide-react";

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const formatCurrency = useFormatCurrency();
  const getTransactionIcon = (description: string) => {
    // Simplificado para el ejemplo, podríamos expandirlo con más iconos
    return description.toLowerCase().includes('viaje') ? Plane : Briefcase;
  };

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.description);
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>
                  {new Date(transaction.date).toLocaleString('es-PE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Lima'
                  })}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "income" ? "text-success" : "text-danger"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(Math.abs(transaction.amount))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
