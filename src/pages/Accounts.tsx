import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export const AccountsPage = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Cuenta Principal', balance: 8000, color: '#3b82f6' },
    { id: 2, name: 'Ahorros', balance: 4000, color: '#f59e0b' },
    { id: 3, name: 'Inversiones', balance: 3000, color: '#8b5cf6' }
  ]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const handleAddAccount = (newAccount) => {
    if (accounts.length >= 3) {
      alert('Límite de 3 cuentas alcanzado');
      return;
    }
    setAccounts([...accounts, {
      id: accounts.length + 1,
      ...newAccount,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    }]);
  };
  
  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Cuentas */}
        <Card>
          <CardHeader>
            <CardTitle>Cuentas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[300px] w-full max-w-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Cuenta Principal', value: 8000, fill: '#3b82f6' },
                      { name: 'Ahorros', value: 4000, fill: '#f59e0b' },
                      { name: 'Inversiones', value: 3000, fill: '#8b5cf6' }
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {[
                      { name: 'Cuenta Principal', value: 8000, fill: '#3b82f6' },
                      { name: 'Ahorros', value: 4000, fill: '#f59e0b' },
                      { name: 'Inversiones', value: 3000, fill: '#8b5cf6' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ payload }) => (
                      <div className="bg-white p-2 rounded-lg shadow-lg">
                        <p className="font-medium">{payload?.[0]?.name}</p>
                        <p>${payload?.[0]?.value?.toLocaleString()}</p>
                      </div>
                    )}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                    formatter={(value) => (
                      <span className="text-sm text-gray-600">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-3xl font-bold">
              ${totalBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* Sección de Cuentas */}
        <Card>
          <CardHeader>
            <CardTitle>Cuentas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de cuenta</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Cuenta Bancaria</SelectItem>
                    <SelectItem value="digital">Billetera Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nombre del banco/proveedor</Label>
                <Input placeholder="Ej: Banco Nacional, PayPal, etc." />
              </div>

              <div className="space-y-2">
                <Label>Número de cuenta/ID</Label>
                <Input placeholder="Número de cuenta o identificador" />
              </div>

              <div className="space-y-2">
                <Label>Saldo inicial</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Agregar Cuenta</Button>
            </div>
          </CardContent>
        </Card>

        {/* Sección de Ahorros */}
        <Card>
          <CardHeader>
            <CardTitle>Ahorros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Ahorrado</Label>
                <Input value="$5,000" disabled />
              </div>
              <div className="space-y-2">
                <Label>Meta de Ahorro</Label>
                <Input type="number" placeholder="Ingresa tu meta" />
              </div>
              <div className="space-y-2">
                <Label>Fecha Objetivo</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Progreso</Label>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: '45%' }}
                  />
                </div>
                <p className="text-sm text-gray-500">45% completado</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Guardar Meta</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
