import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { Plus, Clock, User, Scissors, DollarSign, MessageCircle } from 'lucide-react';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Label from '../ui/Label';

const locales = {
  'es': es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface AppointmentEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  status: string;
  addons: any[];
  totalDuration: number;
}

interface Client {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
}

export default function AgendaView() {
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("week");

  const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);

  const fetchData = async () => {
    try {
      const [aptsRes, clientsRes, servicesRes] = await Promise.all([
        fetch("http://localhost:3000/api/appointments"),
        fetch("http://localhost:3000/api/clients"),
        fetch("http://localhost:3000/api/services")
      ]);

      const aptsData = await aptsRes.json();
      const clientsData = await clientsRes.json();
      const servicesData = await servicesRes.json();

      setClients(clientsData);
      setServices(servicesData);

      const formattedEvents = aptsData.map((apt: any) => {
        const startDate = new Date(apt.date);
        const durationInMs = (apt.totalDuration || apt.service.duration) * 60 * 1000; 
        const endDate = new Date(startDate.getTime() + durationInMs);

        return {
          id: apt.id,
          title: `${apt.service.name} - ${apt.client.name}`,
          start: startDate,
          end: endDate,
          resource: apt.status,
          clientName: apt.client.name,
          clientPhone: apt.client.phone,
          serviceName: apt.service.name,
          price: apt.totalPrice || apt.service.price,
          status: apt.status,
          addons: apt.addons || [],
          totalDuration: apt.totalDuration || apt.service.duration
        };
      });

      setAppointments(formattedEvents);
    } catch (error) {
      console.error("Error cargando los datos de la agenda:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const appointmentData = {
      clientId: formData.get("clientId"),
      serviceId: formData.get("serviceId"),
      date: formData.get("date"),
      status: formData.get("status"),
    };

    try {
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchData(); 
      }
    } catch (error) {
      console.error("Error agendando el turno:", error);
    }
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = 'var(--primary)';
    if (event.resource === 'pendiente') backgroundColor = '#eab308'; 
    else if (event.resource === 'confirmado') backgroundColor = '#22c55e'; 

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        padding: '2px 6px',
        fontSize: '0.85rem',
        lineHeight: '1.2',
        overflow: 'hidden' 
      }
    };
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = `¡Hola ${name}! Te escribo de Barber Studio 💈 para recordarte tu turno.`;
    const cleanPhone = phone.replace(/\D/g, ''); 
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      <div className="flex justify-end">
        <Button className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Nuevo Turno Manual
        </Button>
      </div>

      <Card className="bg-card text-card-foreground p-2 sm:p-6 shadow-sm border border-border">
        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center text-muted-foreground animate-pulse font-medium">
            Cargando agenda...
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <div className="h-[600px] min-w-[800px] font-['Merriweather_Sans']">
              <Calendar
                localizer={localizer}
                events={appointments}
                startAccessor="start"
                endAccessor="end"
                culture="es"
                
                date={currentDate}
                onNavigate={(newDate) => setCurrentDate(newDate)}
                view={currentView as any}
                onView={(newView) => setCurrentView(newView as any)}

                onSelectEvent={(event) => setSelectedEvent(event)}

                messages={{
                  next: ">",
                  previous: "<",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                  agenda: "Agenda",
                  date: "Fecha",
                  time: "Hora",
                  event: "Turno",
                  noEventsInRange: "No hay turnos en este rango de fechas.",
                }}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day', 'agenda']}
                min={new Date(0, 0, 0, 8, 0, 0)} 
                max={new Date(0, 0, 0, 21, 0, 0)} 
              />
            </div>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Agendar Nuevo Turno">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>cliente</Label>
            {clients.length === 0 ? (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                No hay clientes regsitrados.
              </div>
            ) : (
              <select name="clientId" required className="block w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary bg-card text-card-foreground outline-none">
                <option value="">Seleccioná una cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <Label>Servicio</Label>
            <select name="serviceId" required className="block w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary bg-card text-card-foreground outline-none">
              <option value="">Seleccioná un servicio...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.name} ({service.duration} min)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha y Hora</Label>
              <input type="datetime-local" name="date" required className="block w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary bg-card text-card-foreground outline-none"/>
            </div>
            <div>
              <Label>Estado</Label>
              <select name="status" className="block w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary bg-card text-card-foreground outline-none">
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={clients.length === 0}>Agendar Turno</Button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={selectedEvent !== null} 
        onClose={() => setSelectedEvent(null)} 
        title="Detalles del Turno"
      >
        {selectedEvent && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">Información de Cita</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                selectedEvent.status === 'confirmado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedEvent.status}
              </span>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-secondary rounded-lg text-primary"><User className="w-5 h-5"/></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">cliente</p>
                  <p className="font-medium">{selectedEvent.clientName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-secondary rounded-lg text-primary"><Scissors className="w-5 h-5"/></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Servicio</p>
                  <p className="font-medium">{selectedEvent.serviceName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-secondary rounded-lg text-primary"><Clock className="w-5 h-5"/></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Horario y Duración</p>
                  <p className="font-medium">
                    {selectedEvent.start.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })} <br/>
                    <span className="text-primary font-bold">
                      {selectedEvent.start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                    </span> 
                    <span className="text-gray-500 ml-2">({selectedEvent.totalDuration} min)</span>
                  </p>
                </div>
              </div>

              {selectedEvent.addons && selectedEvent.addons.length > 0 && (
                <div className="flex items-start gap-3 text-gray-700 mt-2">
                  <div className="p-2 bg-secondary rounded-lg text-primary mt-1"><Plus className="w-5 h-5"/></div>
                  <div className="w-full">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Adicionales</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.addons.map((addon: any) => (
                        <span key={addon.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm border border-border">
                          {addon.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700 mt-2 border-t border-border pt-4">
                <div className="p-2 bg-secondary rounded-lg text-primary"><DollarSign className="w-5 h-5"/></div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Total a Cobrar</p>
                  <p className="text-lg font-bold text-foreground">${selectedEvent.price.toLocaleString('es-AR')}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-border">
              <button 
                onClick={() => handleWhatsApp(selectedEvent.clientPhone, selectedEvent.clientName)}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Avisar por WhatsApp
              </button>
              <Button onClick={() => setSelectedEvent(null)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}