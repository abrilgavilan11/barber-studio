import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CalendarPlus, X, Info } from 'lucide-react';

interface Service {
  id: string | number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category?: { id: string; name: string };
  image?: string | null;
}

export default function Catalog() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/services');
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error trayendo los servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center bg-background min-h-screen">
        <p className="text-xl text-primary font-medium animate-pulse">Cargando catálogo...</p>
      </div>
    );
  }

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  const groupedServices = services.reduce((acc, service) => {
    const categoryName = service.category?.name || 'Sin Categoría';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans min-h-screen relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-3">Nuestro Catálogo</h1>
          <p className="text-muted-foreground text-lg">Explorá nuestros servicios y preparate para lucir impecable.</p>
        </header>

        {services.length === 0 ? (
          <p className="text-center text-muted-foreground">Todavía no hay servicios disponibles.</p>
        ) : (
          (Object.entries(groupedServices) as [string, Service[]][]).map(([categoryName, catServices]) => (
            <div key={categoryName} className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8 pb-3 border-b-2 border-border">
                {categoryName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {catServices.map((service) => (
                  <div 
                    key={service.id} 
                    onClick={() => setSelectedService(service)}
                    className="bg-card rounded-2xl shadow-sm border border-border hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between cursor-pointer overflow-hidden group animate-fade-in-up"
                  >
                    {/* Imagen del servicio */}
                    <div className="w-full h-48 overflow-hidden relative border-b border-border">
                      <img 
                        src={service.image || DEFAULT_IMAGE} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      
                      {/* Descripción corta */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                        {service.description}
                      </p>
                      
                      <div className="flex justify-between items-center border-t border-border pt-4 mb-4">
                        <span className="text-xl font-black text-primary">
                          ${service.price.toLocaleString('es-AR')}
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(service);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-secondary text-primary border border-border py-2.5 px-4 rounded-xl font-medium hover:bg-secondary/80 hover:border-primary transition-all active:scale-95"
                      >
                        <Info className="w-4 h-4" />
                        Ver más detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE DETALLES */}
      {selectedService && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-card rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-pop-in border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen Modal */}
            <div className="w-full md:w-2/5 h-48 md:h-auto relative">
              <img 
                src={selectedService.image || DEFAULT_IMAGE} 
                alt={selectedService.name} 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-3 left-3 md:hidden bg-black/40 text-white p-1.5 rounded-full hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido Modal */}
            <div className="p-6 md:p-8 w-full md:w-3/5 flex flex-col relative">
              <button 
                onClick={() => setSelectedService(null)}
                className="hidden md:flex absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors bg-secondary p-2 rounded-full hover:bg-secondary/80"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="inline-block bg-secondary text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-3">
                {selectedService.category?.name || 'Sin Categoría'}
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
                {selectedService.name}
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                {selectedService.description}
              </p>

              <div className="space-y-3 bg-secondary/30 p-4 rounded-2xl mb-6 border border-border">
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-5 h-5 text-primary" />
                    Duración Estimada
                  </div>
                  <span className="font-bold text-card-foreground">{selectedService.duration} min</span>
                </div>
                <div className="h-px bg-border w-full" />
                <div className="flex items-center justify-between text-card-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-xl font-black text-primary">$</span>
                    Precio
                  </div>
                  <span className="text-2xl font-black text-primary">
                    ${selectedService.price.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <Link 
                to="/reservar" 
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 px-4 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <CalendarPlus className="w-5 h-5" />
                Reservar este turno
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}