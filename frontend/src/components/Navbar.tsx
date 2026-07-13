import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Scissors, Lock, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "superusuario";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            <span className="font-semibold text-xl text-foreground">Barber Studio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive("/")
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/servicios"
              className={`transition-colors ${
                isActive("/servicios")
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              Servicios
            </Link>

            {user && !isAdmin && (
              <Link
                to="/mis-turnos"
                className={`transition-colors ${
                  isActive("/mis-turnos")
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Mis Turnos
              </Link>
            )}

            <Link
              to="/reservar"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
            >
              Reservar
            </Link>

            {isAdmin && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 transition-colors ${
                  isActive("/dashboard")
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-destructive/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/admin/login"
                title="Iniciar Sesión"
                className={`p-2 rounded-full transition-colors ${
                  isActive("/admin/login")
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                }`}
              >
                <Lock className="w-4 h-4" />
              </Link>
            )}
            <ThemeToggle />
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground cursor-pointer"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        </nav>
      </header>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Slide-in Menu */}
      <div className={`
        fixed inset-y-0 right-0 z-[70] w-72 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col md:hidden
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg text-foreground">Barber Studio</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col gap-4 p-6 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 mb-2 border-b border-border/50">
            <span className="text-sm font-medium text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
          <Link
            to="/"
            className={`px-4 py-3 rounded-xl transition-colors ${
              isActive("/")
                ? "bg-secondary text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/servicios"
            className={`px-4 py-3 rounded-xl transition-colors ${
              isActive("/servicios")
                ? "bg-secondary text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Servicios
          </Link>

          {user && !isAdmin && (
            <Link
              to="/mis-turnos"
              className={`px-4 py-3 rounded-xl transition-colors ${
                isActive("/mis-turnos")
                  ? "bg-secondary text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Mis Turnos
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/dashboard"
              className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                isActive("/dashboard")
                  ? "bg-secondary text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary/50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              Panel de Control
            </Link>
          )}

          <Link
            to="/reservar"
            className="px-4 py-3 mt-2 bg-primary text-primary-foreground rounded-xl text-center font-medium hover:bg-primary/90 transition-colors shadow-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            Reservar
          </Link>

          <div className="mt-4 pt-4 border-t border-border">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-destructive/10 rounded-xl transition-colors w-full text-left cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className={`px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                  isActive("/admin/login")
                    ? "bg-secondary text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary/50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Lock className="w-5 h-5" />
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
      
    </>
  );
}