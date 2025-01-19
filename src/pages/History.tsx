import { useState, useEffect } from "react";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";

const History = () => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    startDate: null,
    endDate: null,
  });

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

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Primero obtener todas las transacciones sin filtros para verificar datos
      const { data: allData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);
        
      console.log('All transactions:', allData?.map(t => ({
        id: t.id,
        type: t.type,
        date: t.date,
        amount: t.amount
      })));

      // Luego aplicar filtros
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);

      console.log('Filters:', filters);
      if (filters.type) {
        query = query.ilike('type', filters.type.toLowerCase());
        console.log('Type filter applied:', filters.type.toLowerCase());
      }
        if (filters.startDate && filters.endDate) {
          // Convertir fechas locales a UTC manteniendo el mismo día
          const startUTC = new Date(filters.startDate);
          startUTC.setUTCHours(0, 0, 0, 0);
          
          const endUTC = new Date(filters.endDate);
          endUTC.setUTCHours(23, 59, 59, 999);
          
          // Ajustar para zona horaria de Perú (-5 horas)
          const peruOffset = -5 * 60;
          const startWithOffset = new Date(startUTC.getTime() - (peruOffset * 60 * 1000));
          const endWithOffset = new Date(endUTC.getTime() - (peruOffset * 60 * 1000));
          
          console.log('Date range UTC:', {
            start: startWithOffset.toISOString(),
            end: endWithOffset.toISOString(),
            localStart: filters.startDate.toString(),
            localEnd: filters.endDate.toString(),
            timezoneOffset: peruOffset
          });
          
          query = query
            .gte('date', startWithOffset.toISOString())
            .lte('date', endWithOffset.toISOString())
            .order('date', { ascending: true });
          
        console.log('Full query:', {
          table: 'transactions',
          filters: {
            user_id: user.id,
            date: {
              gte: startUTC.toISOString(),
              lte: endUTC.toISOString()
            }
          }
        });
      } else {
        // Caso normal: rango de días
        if (filters.startDate) {
          const start = new Date(filters.startDate);
          start.setUTCHours(0, 0, 0, 0);
          query = query.gte('date', start.toISOString().replace('Z', '+00:00'));
        }
        if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setUTCHours(23, 59, 59, 999);
          query = query.lte('date', end.toISOString().replace('Z', '+00:00'));
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      
      console.log('Fetched transactions:', data.map(t => ({
        id: t.id,
        type: t.type,
        date: t.date,
        amount: t.amount
      })));
      
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    if (name === 'startDate' && value && filters.endDate && value > filters.endDate) {
      setFilters(prev => ({ ...prev, startDate: value, endDate: null }));
    } else if (name === 'endDate' && value && filters.startDate && value < filters.startDate) {
      setFilters(prev => ({ ...prev, endDate: null }));
      alert('La fecha final no puede ser anterior a la fecha inicial');
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

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
        
        <div className="flex flex-col md:flex-row gap-4">
          <Select onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de transacción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Ingresos</SelectItem>
              <SelectItem value="expense">Gastos</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, 'PPP') : 'Fecha inicio'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => handleFilterChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, 'PPP') : 'Fecha fin'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => handleFilterChange('endDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button onClick={fetchTransactions} disabled={loading}>
            {loading ? 'Cargando...' : 'Filtrar'}
          </Button>
        </div>

        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default History;
