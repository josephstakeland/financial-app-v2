import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useUser();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await signIn(email, password);
      console.log('Login response:', { data, error });
      
      if (error) {
        setError("Credenciales incorrectas");
        return;
      }
      
      if (data?.user) {
        console.log('User logged in:', data.user);
        navigate("/dashboard", { replace: true });
        return;
      }
      
      setError("Error desconocido al iniciar sesión");
    } catch (err) {
      setError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-2 mb-6">
          <DollarSign className="h-8 w-8" />
          <h1 className="text-2xl font-bold text-center">5luka</h1>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </Button>
          <div className="text-center text-sm mt-4">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={async () => {
                try {
                  await signUp(email, password);
                  navigate('/');
                } catch (err) {
                  setError('Error al registrarse');
                }
              }}
            >
              Regístrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
