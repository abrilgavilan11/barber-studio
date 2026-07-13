import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Scissors, Star, Award, ArrowRight, Loader2 } from "lucide-react";

interface Service {
  id: string | number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
}

const ICONS = [Scissors, Star, Award];

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/services');
        if (!response.ok) throw new Error('Error al conectar con la API');
        
        const data = await response.json();
        setServices(data.slice(0, 3));
      } catch (error) {
        console.error("Error trayendo los servicios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Servicios Destacados
          </h2>
          <p className="text-lg text-muted-foreground">
            Descubrí nuestros tratamientos más populares
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
             <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
             No hay servicios disponibles por el momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => {
              const Icon = ICONS[index % ICONS.length];
              return (
                <div
                  key={service.id}
                  className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border flex flex-col group animate-fade-in-up hover:-translate-y-1"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{service.description}</p>
                  <Link
                    to="/servicios"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-auto font-medium"
                  >
                    Ver Detalles
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/servicios"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
          >
            Ver Catálogo Completo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}