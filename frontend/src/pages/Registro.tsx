import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Shield, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "cliente";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrarse");
      }

      login(data);

      if (data.role === "admin" || data.role === "superusuario") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center py-12 animate-fade-in">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Crear Cuenta</h1>
          <p className="text-muted-foreground">Completá tus datos para registrarte</p>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-input rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground placeholder:text-muted-foreground outline-none transition-all"
                  placeholder="Juan Perez"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-input rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground placeholder:text-muted-foreground outline-none transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-input rounded-lg focus:ring-2 focus:ring-primary bg-input-background text-foreground placeholder:text-muted-foreground outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Registrando...</> : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link to="/admin/login" className="text-primary font-bold hover:underline transition-colors">
              Iniciá sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}