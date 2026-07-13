import { useState, useEffect } from "react";
import AgendaView from "../components/dashboard/AgendaView";
import CatalogManager from "../components/dashboard/CatalogManager";
import ClientManager from "../components/dashboard/ClientManager";
import CategoryManager from "../components/dashboard/CategoryManager";
import AddonManager from "../components/dashboard/AddonManager";
import SettingsManager from "../components/dashboard/SettingsManager";
import UserManager from "../components/dashboard/UserManager";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Scissors, 
  Check, 
  X, 
  Clock, 
  TrendingUp,
  Users,
  Tags,
  PlusSquare,
  Settings,
  UserCog
} from "lucide-react";
import Title from "../components/ui/Title";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

interface Appointment {
  id: string;
  date: string;
  status: string;
  client: { name: string };
  service: { name: string; price: number };
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/appointments");
      if (!response.ok) throw new Error("Error en la respuesta de la API");
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error trayendo turnos:", error);
      setAppointments([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "inicio") {
      fetchAppointments();
    }
  }, [activeTab]);

  const handleConfirm = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmado" }),
      });
      if (response.ok) fetchAppointments();
    } catch (error) {
      console.error("Error confirmando turno:", error);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que querés cancelar y eliminar este turno?")) return;
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchAppointments();
    } catch (error) {
      console.error("Error cancelando turno:", error);
    }
  };

  const todayString = new Date().toLocaleDateString('es-AR');
  
  const turnosHoy = appointments.filter(apt => new Date(apt.date).toLocaleDateString('es-AR') === todayString).length;
  const pendientes = appointments.filter(apt => apt.status === "pendiente").length;
  
  const ingresosEstimados = appointments.reduce((total, apt) => total + (apt.service?.price || 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-['Merriweather_Sans']">
      
      {/* Mobile Header */}
      <div className="md:hidden p-3 bg-card border-b border-border sticky top-0 z-30 flex justify-center">
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg w-full justify-center shadow-sm"
        >
          <LayoutDashboard className="w-5 h-5 text-primary" />
          <span className="font-semibold">Abrir Panel de Administración</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card text-card-foreground border-r border-border flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-border flex items-center justify-between md:justify-start gap-2">
          <div className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-foreground">Barber Studio</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => { setActiveTab("inicio"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "inicio" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Inicio</span>
          </button>

          <button 
            onClick={() => { setActiveTab("agenda"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "agenda" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="font-medium">Agenda</span>
          </button>

          <button 
            onClick={() => { setActiveTab("catalogo"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "catalogo" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Scissors className="w-5 h-5" />
            <span className="font-medium">Catálogo</span>
          </button>

          <button 
            onClick={() => { setActiveTab("categorias"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "categorias" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Tags className="w-5 h-5" />
            <span className="font-medium">Categorías</span>
          </button>

          <button 
            onClick={() => { setActiveTab("adicionales"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "adicionales" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <PlusSquare className="w-5 h-5" />
            <span className="font-medium">Adicionales</span>
          </button>

          <button 
            onClick={() => { setActiveTab("clientes"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "clientes" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">clientes</span>
          </button>

          <button 
            onClick={() => { setActiveTab("usuarios"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "usuarios" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <UserCog className="w-5 h-5" />
            <span className="font-medium">Usuarios</span>
          </button>

          <button 
            onClick={() => { setActiveTab("configuracion"); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "configuracion" 
                ? "bg-primary text-white shadow-md" 
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Configuración</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === "inicio" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <Title level={1} className="!mb-1">Panel de Control</Title>
                  <p className="text-muted-foreground">Bienvenido de nuevo. Aquí está el resumen de tu negocio.</p>
                </div>
                <Button className="md:w-auto" onClick={() => { setActiveTab("agenda"); setIsMobileMenuOpen(false); }}>
                  + Nuevo Turno Manual
                </Button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6 bg-card text-card-foreground border-l-4 border-l-primary">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Turnos para Hoy</p>
                      <h3 className="text-3xl font-bold text-foreground">
                        {isLoading ? "-" : turnosHoy}
                      </h3>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <CalendarDays className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card text-card-foreground border-l-4 border-l-yellow-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Solicitudes Pendientes</p>
                      <h3 className="text-3xl font-bold text-foreground">
                        {isLoading ? "-" : pendientes}
                      </h3>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card text-card-foreground border-l-4 border-l-green-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Ingresos Estimados</p>
                      <h3 className="text-3xl font-bold text-foreground">
                        {isLoading ? "-" : `$${ingresosEstimados.toLocaleString('es-AR')}`}
                      </h3>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>
              </div>
              
              <Card className="bg-card text-card-foreground">
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <Title level={3} className="!mb-0">Turnos Recientes</Title>
                  <button 
                    onClick={() => { setActiveTab("agenda"); setIsMobileMenuOpen(false); }}
                    className="text-primary text-sm font-medium hover:underline cursor-pointer"
                  >
                    Ver agenda completa
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary text-foreground text-sm uppercase tracking-wider">
                        <th className="p-4 font-semibold">cliente</th>
                        <th className="p-4 font-semibold">Servicio</th>
                        <th className="p-4 font-semibold">Fecha y Hora</th>
                        <th className="p-4 font-semibold">Estado</th>
                        <th className="p-4 font-semibold text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {isLoading ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground animate-pulse">
                            Cargando turnos...
                          </td>
                        </tr>
                      ) : appointments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No hay turnos registrados.
                          </td>
                        </tr>
                      ) : (
                        appointments.slice(0, 5).map((apt) => {
                          const aptDate = new Date(apt.date);
                          const formattedDate = aptDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
                          const formattedTime = aptDate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

                          return (
                            <tr key={apt.id} className="hover:bg-secondary/20 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-xs uppercase">
                                    {apt.client.name.charAt(0)}
                                  </div>
                                  <span className="font-medium text-foreground">{apt.client.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground">{apt.service.name}</td>
                              <td className="p-4">
                                <div className="flex flex-col">
                                  <span className="font-medium text-foreground capitalize">{formattedDate}</span>
                                  <span className="text-sm text-primary">{formattedTime} hs</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  apt.status === "confirmado" 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {apt.status === "confirmado" ? <Check className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button 
                                    title="Confirmar turno"
                                    onClick={() => handleConfirm(apt.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                                    disabled={apt.status === "confirmado"}
                                  >
                                    <Check className="w-5 h-5" />
                                  </button>
                                  <button 
                                    title="Cancelar turno"
                                    onClick={() => handleCancel(apt.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
          
          {/* VISTA: AGENDA             */}
          {activeTab === "agenda" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-8">
                <Title level={1}>Agenda de Turnos</Title>
                <p className="text-muted-foreground">Gestioná tus horarios y disponibilidad.</p>
              </header>
              <AgendaView />
            </div>
          )}

          {/* VISTA: CATÁLOGO           */}
          {activeTab === "catalogo" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-8">
                <Title level={1}>Gestión de Catálogo</Title>
                <p className="text-muted-foreground">Administrá tus servicios, precios y duraciones.</p>
              </header>
              <CatalogManager />
            </div>
          )}

          {/* VISTA: clienteS           */}
          {activeTab === "clientes" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-8">
                <Title level={1}>Base de clientes</Title>
                <p className="text-muted-foreground">Historial y contacto de las personas que te eligen.</p>
              </header>
              <ClientManager />
            </div>
          )}

          {/* VISTA: CATEGORÍAS           */}
          {activeTab === "categorias" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-8">
                <Title level={1}>Categorías</Title>
                <p className="text-muted-foreground">Administrá las categorías de tus servicios.</p>
              </header>
              <CategoryManager />
            </div>
          )}

          {/* VISTA: ADICIONALES           */}
          {activeTab === "adicionales" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-8">
                <Title level={1}>Adicionales y Extras</Title>
                <p className="text-muted-foreground">Gestioná los opcionales como retiro o nail art.</p>
              </header>
              <AddonManager />
            </div>
          )}

          {/* VISTA: USUARIOS           */}
          {activeTab === "usuarios" && (
            <div className="animate-in fade-in duration-300">
              <header className="mb-8">
                <Title level={1}>Equipo y Permisos</Title>
                <p className="text-muted-foreground">Gestioná los accesos de tu equipo.</p>
              </header>
              <UserManager />
            </div>
          )}

          {/* VISTA: CONFIGURACIÓN           */}
          {activeTab === "configuracion" && (
            <div className="animate-in fade-in duration-300">
              <SettingsManager />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}