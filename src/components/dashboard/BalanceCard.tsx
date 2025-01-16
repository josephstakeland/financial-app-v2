import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormatCurrency } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  title: string;
  type: "income" | "expense" | "total";
}

export function BalanceCard({ balance, title, type }: BalanceCardProps) {
  const formatCurrency = useFormatCurrency();
  const getColorClass = () => {
    switch (type) {
      case "income":
        return "text-success";
      case "expense":
        return "text-danger";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${getColorClass()}`}>
          {type === "expense" ? "-" : ""}
          {formatCurrency(Math.abs(balance))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {type === "total" ? "Balance actual" : "Este mes"}
        </p>
      </CardContent>
    </Card>
  );
}
