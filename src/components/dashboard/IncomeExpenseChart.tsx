import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useCurrency } from "@/context/CurrencyContext";
import { useTheme } from "@/context/ThemeContext";

interface Transaction {
  date: string;
  income: number;
  expenses: number;
}

interface IncomeExpenseChartProps {
  data: Transaction[];
  incomeColor?: string;
  expenseColor?: string;
  axisColor?: string;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value: number;
    payload: Transaction;
    dataKey: string;
  }[];
  label?: string;
};

interface CustomTooltipPropsExtended extends CustomTooltipProps {
  incomeColor: string;
  expenseColor: string;
}

const CustomTooltip = ({ active, payload, label, incomeColor, expenseColor }: CustomTooltipPropsExtended) => {
  const { currency } = useCurrency();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p 
            key={`tooltip-${index}`}
            className="text-sm"
            style={{ 
              color: entry.dataKey === 'income' ? incomeColor : expenseColor,
              textShadow: `0 0 5px ${entry.dataKey === 'income' ? incomeColor : expenseColor}`
            }}
          >
            {entry.value.toFixed(2)} {currency}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function IncomeExpenseChart({ 
  data,
  incomeColor = '#10b981',
  expenseColor = '#ef4444',
  axisColor = '#fff'
}: IncomeExpenseChartProps) {
  const { currency } = useCurrency();
  const { isDarkMode } = useTheme();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Ingresos vs Gastos (Últimos 30 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                stroke={isDarkMode ? "#444" : "#ddd"}
                strokeOpacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ 
                  fill: isDarkMode ? "#10b981" : "#111827",
                  filter: isDarkMode 
                    ? 'drop-shadow(0 0 4px rgba(16,185,129,0.8))' 
                    : 'drop-shadow(0 0 4px rgba(0,0,0,0.4))',
                  fontWeight: 600
                }}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} ${currency}`}
                tick={{ 
                  fill: isDarkMode ? "#10b981" : "#111827",
                  filter: isDarkMode 
                    ? 'drop-shadow(0 0 4px rgba(16,185,129,0.8))' 
                    : 'drop-shadow(0 0 4px rgba(0,0,0,0.4))',
                  fontWeight: 600
                }}
              />
              <Tooltip content={<CustomTooltip incomeColor={incomeColor} expenseColor={expenseColor} />} />
              <Legend 
                wrapperStyle={{
                  paddingTop: '20px'
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Ingresos"
                stroke={incomeColor}
                strokeWidth={3}
                dot={{ r: 4, fill: incomeColor, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${incomeColor})`,
                  animation: 'neon-pulse 2s infinite alternate'
                }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Gastos"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: expenseColor, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                animationEasing="ease-in-out"
                style={{
                  filter: 'drop-shadow(0 0 8px #ef4444)',
                  animation: 'neon-pulse 2s infinite alternate'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
