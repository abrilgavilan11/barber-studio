import { useState, useEffect } from "react";
import { Shield, User, ShieldAlert } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserManager() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/users`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!window.confirm(`¿Seguro que querés cambiar el rol a ${newRole.toUpperCase()}?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`}/api/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert("Hubo un error al actualizar el rol.");
      }
    } catch (error) {
      console.error("Error al actualizar rol:", error);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h2>
          <p className="text-primary">Administrá quién tiene acceso al panel de control.</p>
        </div>
      </div>

      <Card className="bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary text-foreground text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Usuario</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Rol Actual</th>
                <th className="p-4 font-semibold text-right">Cambiar Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground animate-pulse">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium text-foreground flex items-center gap-3">
                      <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                        {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      {user.name}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role === 'admin' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : 'bg-gray-100 text-gray-600 border border-border'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {user.role === 'admin' ? (
                        <Button 
                          variant="ghost" 
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-sm py-1.5"
                          onClick={() => handleRoleChange(user.id, "cliente")}
                        >
                          Quitar Admin
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 text-sm py-1.5"
                          onClick={() => handleRoleChange(user.id, "admin")}
                        >
                          <ShieldAlert className="w-4 h-4 mr-1 inline" />
                          Hacer Admin
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
