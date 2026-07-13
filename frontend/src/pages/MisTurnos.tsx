import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Loader2, History, CalendarCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MisTurnos() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/appointments`);
        if (!response.ok) throw new Error("Error al cargar los turnos");
        
        const data = await response.json();

        const misTurnos = data.filter(
          (apt: any) => apt.client?.userId === user?.id
        );

        misTurnos.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setAppointments(misTurnos);
      } catch (error) {
        console.error("Error trayendo los turnos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background px-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground mb-4">Acceso Denegado</h2>
        <p className="text-muted-foreground mb-6 text-center">Tenés que iniciar sesión para ver tus turnos.</p>
        <Link to="/admin/login" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all active:scale-95 shadow-lg">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const ahora = new Date();
  const proximos = appointments.filter((apt) => new Date(apt.date) >= ahora);
  const historial = appointments.filter((apt) => new Date(apt.date) < ahora && apt.status !== "cancelado");

  const formatearFecha = (fechaStr: string) => {
    const d = new Date(fechaStr);
    return {
      dia: d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }),
      hora: d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
    };
  };

  return (
    <div className="bg-background min-h-screen py-12 md:py-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-10 border-b border-border pb-6 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">¡Hola, {user.name}!</h1>
          <p className="text-muted-foreground">Acá podés gestionar todas tus reservas en Barber Studio.</p>
        </header>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-medium">Buscando tus turnos...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-12 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Aún no tenés turnos</h3>
            <p className="text-muted-foreground mb-6">Parece que todavía no te cortaste con nosotros.</p>
            <Link to="/reservar" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all active:scale-95 shadow-lg">
              <CalendarCheck className="w-5 h-5" />
              Reservar mi primer turno
            </Link>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            
            {/* SECCIÓN: Próximos Turnos */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-primary" /> Próximos Turnos
              </h2>
              {proximos.length === 0 ? (
                <p className="text-muted-foreground italic bg-card p-4 rounded-xl border border-border">No tenés turnos agendados próximamente.</p>
              ) : (
                <div className="grid gap-4">
                  {proximos.map((apt) => {
                    const { dia, hora } = formatearFecha(apt.date);
                    return (
                      <div key={apt.id} className="bg-card p-5 rounded-2xl shadow-sm border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-primary group">
                        <div>
                          <span className="inline-block px-3 py-1 bg-secondary text-primary text-xs font-bold uppercase rounded-full mb-2">
                            {apt.status}
                          </span>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{apt.service?.name || "Servicio"}</h3>
                          <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1 capitalize"><Calendar className="w-4 h-4" /> {dia}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {hora} hs</span>
                          </div>
                        </div>
                        <div className="text-right w-full sm:w-auto">
                          <p className="text-xl font-black text-primary">${apt.service?.price.toLocaleString('es-AR')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SECCIÓN: Historial */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <History className="w-6 h-6 text-primary" /> Historial de Servicios
              </h2>
              {historial.length === 0 ? (
                <p className="text-muted-foreground italic bg-card p-4 rounded-xl border border-border">Todavía no tenés servicios finalizados.</p>
              ) : (
                <div className="grid gap-4 opacity-75">
                  {historial.map((apt) => {
                    const { dia } = formatearFecha(apt.date);
                    return (
                      <div key={apt.id} className="bg-card p-4 rounded-xl shadow-sm border border-border flex justify-between items-center gap-4">
                        <div>
                          <h3 className="font-bold text-foreground">{apt.service?.name || "Servicio"}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{dia}</p>
                        </div>
                        <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/50">
                          Completado
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
}