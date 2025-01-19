import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, CartesianGrid } from "recharts";
import type { TooltipProps } from "recharts";
import { defs, linearGradient, stop } from "recharts/es6";
import { useCurrency } from "@/context/CurrencyContext";
import { useTheme } from "@/context/ThemeContext";

interface ChartData {
  date: string;
  amount: number;
}

interface ExpenseChartProps {
  data: ChartData[];
  title: string;
  color: string;
}

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: {
    value: number;
    payload: ChartData;
  }[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label, color }: CustomTooltipProps & { color: string }) => {
  const { currency } = useCurrency();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg p-3 shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm" style={{ textShadow: `0 0 5px ${color}, 0 0 10px ${color}` }}>
          {payload[0].value.toFixed(2)} {currency}
        </p>
      </div>
    );
  }
  return null;
};

export function ExpenseChart({ data, title, color }: ExpenseChartProps) {
  const { currency } = useCurrency();
  const { isDarkMode } = useTheme();
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid 
                stroke={isDarkMode ? "#444" : "#ddd"}
                strokeOpacity={0.2}
              />
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.02}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ 
                  fill: color,
                  filter: isDarkMode ? `drop-shadow(0 0 2px ${color}) drop-shadow(0 0 5px ${color})` : undefined
                }}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value} ${currency}`}
                tick={{ 
                  fill: color,
                  filter: isDarkMode ? `drop-shadow(0 0 2px ${color}) drop-shadow(0 0 5px ${color})` : undefined
                }}
              />
              <Tooltip content={<CustomTooltip color={color} />} />
              {data.map((entry, index) => (
                <ReferenceLine
                  key={`refLine-${index}`}
                  x={entry.date}
                  stroke={color}
                  strokeOpacity={0.2}
                  strokeWidth={1}
                />
              ))}
              <Line
                type="monotone"
                dataKey="amount"
                stroke={color}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
                animationDuration={500}
                animationEasing="ease-in-out"
                strokeWidth={3}
                fill="url(#areaGradient)"
                style={{
                  filter: `drop-shadow(0 0 8px ${color})`,
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
