import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
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
    <div className="bg-background min-h-screen py-12 md:py-20 flex items-center animate-fade-in">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-muted-foreground">
            Acceso seguro a tu cuenta
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl shadow-xl border border-border p-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-input-background text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border-2 border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-input-background text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/registro"
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Crear cuenta
              </Link>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Ingresar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-secondary/30 border border-border rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Privacidad y Seguridad
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tus datos personales y contraseñas están encriptados y protegidos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <p className="text-xs text-muted-foreground mt-2">
            Soporte: contacto@barberstudio.com
          </p>
        </div>
      </div>
    </div>
  );
}