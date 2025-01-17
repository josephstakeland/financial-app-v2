import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun, DollarSign } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useTheme } from "next-themes";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [hasChanges, setHasChanges] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const { user } = useUser();
  const { toast } = useToast();

  const [tempSettings, setTempSettings] = useState({
    theme: theme,
    currency: currency,
    notificationEnabled: false
  });

  const [notificationEnabled, setNotificationEnabled] = useState(tempSettings.notificationEnabled);

  const handleSettingChange = (setting: string, value: string | boolean) => {
    setTempSettings(prev => ({...prev, [setting]: value}));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          theme_preference: tempSettings.theme,
          currency: tempSettings.currency,
          notifications_enabled: tempSettings.notificationEnabled
        })
        .eq('id', user.id)
        .select();

      if (error) throw error;
      
      if (!data) {
        throw new Error('No se recibieron datos de actualización');
      }

      // Actualizar los estados principales con los valores guardados
      setTheme(tempSettings.theme);
      setCurrency(tempSettings.currency);
      setNotificationEnabled(tempSettings.notificationEnabled);
      
      // Actualizar tempSettings con los valores confirmados
      setTempSettings({
        theme: tempSettings.theme,
        currency: tempSettings.currency,
        notificationEnabled: tempSettings.notificationEnabled
      });
      
      setHasChanges(false);
      
      // Mostrar notificación de éxito
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias se han actualizado correctamente",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      // Mostrar notificación de error
    }
  };

  const handleCancel = () => {
    // Restaurar valores originales
    setNotificationEnabled(false);
    setTheme("light");
    setHasChanges(false);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            Atrás
          </Button>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <div className="w-24"></div> {/* Spacer to balance the layout */}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="h-5 w-5" />
                <div>
                  <Label>Notificaciones Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones de tus transacciones
                  </p>
                </div>
              </div>
                <Switch 
                  checked={tempSettings.notificationEnabled}
                  onCheckedChange={(checked) => handleSettingChange('notificationEnabled', checked)}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moneda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <DollarSign className="h-5 w-5" />
              <div className="flex-1">
                <Label>Moneda Principal</Label>
                <p className="text-sm text-muted-foreground">
                  Selecciona la moneda para mostrar los valores
                </p>
              </div>
              <SelectCurrency 
                onChange={() => setHasChanges(true)}
                handleSettingChange={handleSettingChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Sun className="h-5 w-5" />
                <div>
                  <Label>Modo Oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Cambia entre modo claro y oscuro
                  </p>
                </div>
              </div>
                <Switch 
                  checked={tempSettings.theme === "dark"}
                  onCheckedChange={(checked) => handleSettingChange('theme', checked ? "dark" : "light")}
                />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de acción */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4">
          <div className="mx-auto max-w-4xl flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar cambios
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const SelectCurrency = ({ onChange, handleSettingChange }: { 
  onChange: () => void;
  handleSettingChange: (setting: string, value: string | boolean) => void;
}) => {
  const { currency } = useCurrency();

  const handleChange = (value: string) => {
    handleSettingChange('currency', value);
    onChange();
  };

  const currencies = [
    { code: "USD", name: "Dólar Estadounidense" },
    { code: "EUR", name: "Euro" },
    { code: "MXN", name: "Peso Mexicano" },
    { code: "COP", name: "Peso Colombiano" },
    { code: "ARS", name: "Peso Argentino" },
    { code: "CLP", name: "Peso Chileno" },
    { code: "PEN", name: "Sol Peruano" },
  ];

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecciona moneda" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            {curr.name} ({curr.code})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Settings;
