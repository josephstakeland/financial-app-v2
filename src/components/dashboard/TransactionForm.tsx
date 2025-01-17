import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: "income" | "expense";
    amount: number;
    description: string;
    label: "viajes" | "transporte" | "hogar" | "personal" | "servicios";
    date: string;
  }) => Promise<boolean>;
}

export function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState<"viajes" | "transporte" | "hogar" | "personal" | "servicios">("hogar");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !label) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const success = await onSubmit({
      type,
      amount: Number(amount),
      description,
      label,
      date: new Date().toISOString(),
    });

    if (success) {
      setAmount("");
      setDescription("");
      setOpen(false);
      
      toast({
        title: "Éxito",
        description: "Transacción registrada correctamente",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Nueva Transacción</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Transacción</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Select value={type} onValueChange={(v: "income" | "expense") => setType(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de transacción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Ingreso</SelectItem>
              <SelectItem value="expense">Gasto</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select value={label} onValueChange={(v: "viajes" | "transporte" | "hogar" | "personal" | "servicios") => setLabel(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Etiqueta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viajes">Viajes</SelectItem>
              <SelectItem value="transporte">Transporte</SelectItem>
              <SelectItem value="hogar">Hogar</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="servicios">Servicios</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
